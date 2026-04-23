import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error('GEMINI_API_KEY is not set');
}

const genAI = new GoogleGenerativeAI(apiKey || '');

// Fallback chain: try models in order for 99.9% uptime
const MODELS_TO_TRY = [
  'gemini-2.5-flash',
  'gemini-2.5-flash-lite',
  'gemini-2.0-flash',
  'gemini-2.0-flash-lite',
];

export async function POST(req: Request) {
  try {
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Server configuration error. API key missing.' },
        { status: 500 }
      );
    }

    const { jobDescription, resume, tone } = await req.json();

    if (!jobDescription || !resume) {
      return NextResponse.json(
        { error: 'Job description and resume are required.' },
        { status: 400 }
      );
    }

    const prompt = `You are an expert career coach. Write a tailored cover letter based on the information below.

<job_description>
${jobDescription}
</job_description>

<candidate_background>
${resume}
</candidate_background>

<tone>
${tone}
</tone>

<instructions>
- Write a cover letter of 3-4 concise paragraphs (roughly 200-300 words)
- Open with a specific hook that references something concrete from the job description
- Highlight 2-3 strongest matches between the candidate's background and the role's requirements
- Use the specified tone throughout
- Avoid generic clichés like "I am writing to apply for..." or "I believe I would be a great fit..."
- End with a clear, confident call to action
- Do NOT include placeholder text like [Your Name] or [Company Name] — use details from the inputs where possible, otherwise skip them
- Return ONLY the cover letter text, no preamble, no explanations, no markdown
</instructions>`;

    let coverLetter = '';
    let lastError: any = null;

    for (const modelName of MODELS_TO_TRY) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        coverLetter = result.response.text();
        console.log(`Success with model: ${modelName}`);
        break;
      } catch (e: any) {
        console.log(`Model ${modelName} failed: ${e.message}`);
        lastError = e;
        continue;
      }
    }

    if (!coverLetter) {
      throw lastError || new Error('All models failed');
    }

    return NextResponse.json({ coverLetter });
  } catch (error: any) {
    console.error('Generation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate cover letter' },
      { status: 500 }
    );
  }
}