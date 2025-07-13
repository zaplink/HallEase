// app/api/chatbot/route.ts

import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';

// --- Supabase Setup ---
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// --- Gemini Setup ---
const geminiApiKey = process.env.GOOGLE_GEMINI_API_KEY!;
const genAI = new GoogleGenerativeAI(geminiApiKey);
const geminiModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

export async function POST(req: Request) {
	try {
		const { message } = await req.json();

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
		const initialPrompt = `You are a helpful assistant for a Hall Management System.
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

		const result = await geminiModel.generateContent(initialPrompt);
		const responseText = result.response.text();

		console.log('Gemini Raw Response (Initial):', responseText);

		let geminiResponse: {
			sqlQuery?: string;
			naturalLanguageResponse?: string;
		};
		try {
			geminiResponse = JSON.parse(responseText);
		} catch (e) {
			console.error(
				'Gemini initial response was not valid JSON:',
				responseText,
				e
			);
			return new Response(
				JSON.stringify({
					message:
						'Could not understand the AI response format for query generation. Please try again.',
				}),
				{
					status: 500,
					headers: { 'Content-Type': 'application/json' },
				}
			);
		}

		if (geminiResponse.sqlQuery) {
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

			let finalBotResponse;
			if (data && Array.isArray(data) && data.length > 0) {
				// --- NEW STEP: Send retrieved data back to Gemini for summarization ---
				const summarizationPrompt = `The user asked: "${message}"
            I retrieved the following data from the database:
            ${JSON.stringify(data, null, 2)}

            Please summarize this information in a concise, user-friendly natural language format.
            If the data represents a list of items (like events or halls), list them clearly.
            If it's details about a single item, provide a clear description.
            Focus on providing the key details relevant to the user's original query.
            Avoid technical terms like JSON or database schema.

            Example for events: "Here are the upcoming events: 'BC' by EVV on July 19th at 8:30 AM, 'hello' by mooo on July 20th at 8:30 AM, and 'Sandahana' by Rotaract on July 23rd at 8:30 AM. There are also several events on August 11th."

            Example for a single event detail: "ODS25 is a workshop organized by FOSS Community, scheduled for August 11th, 2025, from 8:30 AM to 10:30 AM. It's expected to have 60 attendees."
            `;

				const summaryResult =
					await geminiModel.generateContent(summarizationPrompt);
				finalBotResponse = summaryResult.response.text();
				console.log('Gemini Raw Response (Summary):', finalBotResponse);
			} else {
				finalBotResponse =
					"I couldn't find any data matching your request.";
			}

			return new Response(JSON.stringify({ message: finalBotResponse }), {
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			});
		} else if (geminiResponse.naturalLanguageResponse) {
			// If Gemini initially decided not to generate SQL, just return its natural language response
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
			// Fallback for unexpected initial Gemini output structure
			return new Response(
				JSON.stringify({
					message:
						"I couldn't understand the AI's initial response structure. Please try rephrasing your question.",
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
