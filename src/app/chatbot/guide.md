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
		const prompt = `You are a helpful assistant for a Hall Management System.
    The user is asking a question about the system's data.
    Your goal is to extract the user's intent and, if possible, formulate a PostgreSQL query to retrieve the relevant information from the database.
    If a direct SQL query is not feasible, describe what information is needed and from which tables.

    Here is the database schema:

    ${JSON.stringify(
		{
			bookings: {
				id: 'uuid',
				name: 'text',
				type: 'text',
				description: 'text',
				attendee_count: 'integer',
				date: 'date',
				start_hour: 'text',
				start_minute: 'text',
				hall_option: 'text',
				organizer: 'text',
				end_hour: 'text',
				end_minute: 'text',
				additional_notes: 'text',
				status: 'text',
			},
			course: {
				id: 'uuid',
				char: 'text',
				digit: 'text',
				name: 'text',
				capacity: 'smallint',
				lecturer_id: 'uuid',
			},
			equipment: {
				id: 'uuid',
				reserve_id: 'uuid',
				description: 'text',
			},
			event: {
				id: 'uuid',
				name: 'text',
				attendee_count: 'integer',
				type: 'text',
				organizer: 'text',
				reserve_id: 'uuid',
				additional_notes: 'text',
				description: 'text',
				additional_file: 'text',
				equipment: 'uuid',
			},
			extra_lecture: {
				id: 'uuid',
				reserve_id: 'uuid',
				course_id: 'uuid',
				type: 'text',
				additional_notes: 'text',
				attendee_count: 'integer',
				additional_file: 'text',
				attendee_file: 'text',
				description: 'text',
				equipment: 'uuid',
			},
			general_lecture: {
				day: 'text',
				id: 'uuid',
				start_time: 'time',
				end_time: 'time',
				course_id: 'uuid',
			},
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
			hall_assign: {
				id: 'uuid',
				reserve_id: 'uuid',
				hall_id: 'uuid',
			},
			lecturer: {
				id: 'uuid',
				name: 'text',
				position: 'text',
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
				modified_date: 'date',
				modified_time: 'time',
				is_submitted: 'boolean',
				is_consented: 'boolean',
				created_date: 'date',
				created_time: 'time',
			},
			profiles: {
				id: 'uuid',
				full_name: 'text',
				role: 'text',
				created_at: 'timestamp',
				pro_pic: 'text',
				last_sign_in_at: 'timestamp with time zone',
				email: 'text',
				position: 'text',
			},
			// ... include other relevant tables from your schema if needed
		},
		null,
		2
	)}

    User query: "${message}"

    Provide a JSON response with either:
    1. A 'sqlQuery' key containing a valid PostgreSQL SELECT query to answer the user's question.
    2. A 'naturalLanguageResponse' key if you cannot form a direct SQL query, explaining what information you need or providing a general answer.

    Example SQL Query for "What halls are available?":
    \`\`\`json
    {
      "sqlQuery": "SELECT code, capacity, building, type, is_available FROM public.hall WHERE is_available = TRUE;"
    }
    \`\`\`

    Example Natural Language Response for "Tell me a joke":
    \`\`\`json
    {
      "naturalLanguageResponse": "I'm a Hall Management System assistant, so I can only help with information related to halls, bookings, courses, and events."
    }
    \`\`\`
    `;

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
