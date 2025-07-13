import { GoogleGenerativeAI } from '@google/generative-ai';

const geminiApiKey = process.env.GOOGLE_GEMINI_API_KEY!;

export const genAI = new GoogleGenerativeAI(geminiApiKey);

export const geminiModel = genAI.getGenerativeModel({
	model: 'gemini-1.5-flash',
});
