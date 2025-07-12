import { geminiModel } from '@/lib/gemini';
import { supabase } from '@/lib/supabaseClient';

export async function POST(req: Request) {
	try {
		// Parse the incoming request body to get the user's message
		const { message } = await req.json();

		// Basic validation: Check if a message was provided
		if (!message) {
			return new Response(
				JSON.stringify({ message: 'Missing message in request body' }),
				{
					status: 400,
					headers: { 'Content-Type': 'application/json' },
				}
			);
		}

		// Prepare the prompt for Gemini
		const prompt = `You are a helpful assistant for a Hall Management System.
The user is asking a question about the system's data.
Your goal is to extract the user's intent and, if possible, formulate a PostgreSQL SELECT query to retrieve the relevant information from the database.
If a direct SQL query is not feasible, provide a general answer in natural language.

Here is the database schema (simplified, showing table names and their column names/types):

${JSON.stringify(
	{
		hall: {
			id: 'uuid',
			code: 'text',
			capacity: 'integer',
			building: 'text',
			description: 'text',
			floor: 'smallint',
			type: 'text',
			is_available: 'boolean',
			energy_consumption: 'smallint',
		},
		reserve: {
			id: 'uuid',
			date: 'date',
			hall_option: 'text',
			status: 'text',
			type: 'text',
			profile_id: 'uuid',
			start_time: 'time',
			end_time: 'time',
			is_submitted: 'boolean',
		},
		event: {
			id: 'uuid',
			name: 'text',
			attendee_count: 'integer',
			type: 'text',
			organizer: 'text',
			reserve_id: 'uuid',
			description: 'text',
		},
		extra_lecture: {
			id: 'uuid',
			reserve_id: 'uuid',
			course_id: 'uuid',
			type: 'text',
			attendee_count: 'integer',
			description: 'text',
		},
		course: {
			id: 'uuid',
			char: 'text',
			digit: 'text',
			name: 'text',
			capacity: 'smallint',
			lecturer_id: 'uuid',
		},
		lecturer: {
			id: 'uuid',
			name: 'text',
			position: 'text',
		},
		profiles: {
			id: 'uuid',
			full_name: 'text',
			role: 'text',
			email: 'text',
			position: 'text',
		},
	},
	null,
	2
)}

User query: "${message}"

Provide a JSON response with either:
1. A 'sqlQuery' key containing a valid PostgreSQL SELECT query to answer the user's question. Use the correct table and column names as provided in the schema. Always include 'public.' prefix for table names.
   Example: To get available halls: {"sqlQuery": "SELECT code, capacity, building FROM public.hall WHERE is_available = TRUE;"}
   Example: To get events for a specific date: {"sqlQuery": "SELECT name, organizer, description FROM public.event JOIN public.reserve ON public.event.reserve_id = public.reserve.id WHERE public.reserve.date = 'YYYY-MM-DD';"}
2. A 'naturalLanguageResponse' key if you cannot form a direct SQL query or if the query is beyond the scope of database lookup (e.g., general knowledge questions).
   Example: {"naturalLanguageResponse": "I am a Hall Management System assistant and can only provide information related to halls, bookings, courses, and events based on the available database."}

IMPORTANT: If generating SQL, ensure it's a simple SELECT query. Do NOT generate INSERT, UPDATE, DELETE, or complex DDL statements. Only provide a query if you are certain it will return relevant information from the schema provided. For "What halls are available?", use the 'is_available' column from the 'hall' table.

Return the response as raw JSON, without Markdown code fences `;

		// Send the prompt to Gemini
		const result = await geminiModel.generateContent(prompt);
		let responseText = result.response.text();

		console.log('Gemini Raw Response:', responseText);

		// Clean the response by removing any Markdown code fences
		responseText = responseText
			.replace(/^```json\n/, '') // Remove opening ```json
			.replace(/\n```$/, '') // Remove closing ```
			.trim();

		console.log('Cleaned Response:', responseText);

		// Parse Gemini's JSON response
		let geminiResponse: {
			sqlQuery?: string;
			naturalLanguageResponse?: string;
		};
		try {
			geminiResponse = JSON.parse(responseText);
		} catch (e) {
			console.error(
				'Gemini response was not valid JSON:',
				responseText,
				e
			);
			return new Response(
				JSON.stringify({
					message:
						'Could not understand the AI response format. Please try again.',
				}),
				{
					status: 500,
					headers: { 'Content-Type': 'application/json' },
				}
			);
		}

		// Act based on Gemini's response
		if (geminiResponse.sqlQuery) {
			// Execute the SQL query using Supabase RPC
			const { data, error } = await supabase.rpc('execute_sql_query', {
				query_string: geminiResponse.sqlQuery,
			});

			if (error) {
				console.error('Supabase query error:', error);
				return new Response(
					JSON.stringify({
						message:
							'An error occurred while fetching data from the database.',
					}),
					{
						status: 500,
						headers: { 'Content-Type': 'application/json' },
					}
				);
			}

			// Format the response
			let formattedResponse;
			if (data && Array.isArray(data) && data.length > 0) {
				formattedResponse = `Here's what I found:\n\`\`\`json\n${JSON.stringify(data, null, 2)}\n\`\`\``;
			} else {
				formattedResponse =
					"I couldn't find any data matching your request.";
			}

			console.log(formattedResponse);

			return new Response(
				JSON.stringify({ message: formattedResponse }),
				{
					status: 200,
					headers: { 'Content-Type': 'application/json' },
				}
			);
		} else if (geminiResponse.naturalLanguageResponse) {
			return new Response(
				JSON.stringify({
					message: geminiResponse.naturalLanguageResponse,
				}),
				{
					status: 200,
					headers: { 'Content-Type': 'application/json' },
				}
			);
		} else {
			return new Response(
				JSON.stringify({
					message:
						"I couldn't understand the AI's response. Please try rephrasing your question.",
				}),
				{
					status: 500,
					headers: { 'Content-Type': 'application/json' },
				}
			);
		}
	} catch (error) {
		console.error('Chatbot API unexpected error:', error);
		return new Response(
			JSON.stringify({ message: 'An internal server error occurred.' }),
			{
				status: 500,
				headers: { 'Content-Type': 'application/json' },
			}
		);
	}
}
