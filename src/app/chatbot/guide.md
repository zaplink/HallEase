```typescript
// pages/api/chatbot.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/supabase'; // Adjust path as needed
import { geminiModel } from '../../lib/gemini'; // Adjust path as needed

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method !== 'POST') {
		return res.status(405).json({ message: 'Method Not Allowed' });
	}

	const { message } = req.body;

	if (!message) {
		return res
			.status(400)
			.json({ message: 'Missing message in request body' });
	}

	try {
		// Step 1: Use Gemini to understand the user's intent and
		// potentially generate a SQL query or identify data needs.


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

------

		const result = await geminiModel.generateContent(prompt);
		const responseText = result.response.text();

		// Attempt to parse the Gemini response as JSON
		let geminiResponse;
		try {
			geminiResponse = JSON.parse(responseText);
		} catch (e) {
			console.error('Gemini response was not valid JSON:', responseText);
			return res
				.status(500)
				.json({
					message:
						'Could not process your request. Please try again.',
				});
		}

		if (geminiResponse.sqlQuery) {
			// Step 2: Execute the generated SQL query using Supabase.
			const { data, error } = await supabase
				.from('public.hall')
				.rpc('execute_query', {
					query_string: geminiResponse.sqlQuery,
				}); // This RPC function is hypothetical, see important note below

			if (error) {
				console.error('Supabase query error:', error);
				return res
					.status(500)
					.json({
						message:
							'An error occurred while fetching data from the database.',
					});
			}

			// Step 3: Format the results into a natural language response.
			// This part requires more advanced logic to convert structured data into readable text.
			// For simplicity, we'll just send the raw data back for now.
			return res.status(200).json({ data });
		} else if (geminiResponse.naturalLanguageResponse) {
			// If Gemini couldn't form a SQL query, send its natural language response.
			return res
				.status(200)
				.json({ message: geminiResponse.naturalLanguageResponse });
		} else {
			// Fallback if Gemini's response structure is unexpected
			return res
				.status(500)
				.json({
					message:
						"I couldn't understand your request fully. Please rephrase.",
				});
		}
	} catch (error) {
		console.error('Chatbot API error:', error);
		return res
			.status(500)
			.json({ message: 'An internal server error occurred.' });
	}
}
```
