const { GoogleGenAI } = require('@google/genai');
const { z } = require('zod');
const { zodToJsonSchema } = require('zod-to-json-schema');
const puppeteer = require('puppeteer');

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});


const interviewReportSchema = z.object({
  matchScore: z.number().describe("The score between 0 to 100 indicating how well the candidate matches the job description based on the analysis of the resume and job description"),
  technicalQuestions: z.array(z.object({
    question: z.string().describe("The technical question can be asked in the interview"),
    intention: z.string().describe("The intention of the interviewer behind asking the technical question"),
    answer: z.string().describe("How to answer this technical question in the interview,what points to be covered in the answer")
  })).describe("Technical questions that can be asked in the interview, along with the intention behind asking those questions"),
  behavioralQuestions: z.array(z.object({
    question: z.string().describe("The behavioral question can be asked in the interview"),
    intention: z.string().describe("The intention of the interviewer behind asking the behavioral question"),
    answer: z.string().describe("How to answer this behavioral question in the interview,what points to be covered in the answer")
  })).describe("Behavioral questions that can be asked in the interview, along with the intention behind asking those questions"),
  skillGaps: z.array(z.object({
    skill: z.string().describe("The skill in which the candidate is lacking"),
    severity: z.enum(["low", "medium", "high"]).describe("The severity of the skill gap")
  })).describe("The skill gaps of the candidate that can be worked upon to improve the chances of cracking the interview"),
  preparationPlan: z.array(z.object({
    day: z.number().describe("The day number of the preparation plan"),
    focus: z.string().describe("The focus of the preparation for that day"),
    tasks: z.array(z.string()).describe("The tasks to be performed on that day to prepare for the interview")
  })).describe("A day-wise preparation plan for the candidate to crack the interview"),
  title: z.string().describe("The title of the job for which the interview report is generated")
})


const interviewGenerateSchema = async ({ resume, jobDescription, selfDescription }) => {

  // const prompt=`Generate an interview report for a candidate with the following details:
  //                     Resume: ${resume}
  //                     Self Description: ${selfDescription}
  //                     Job Description: ${jobDescription}`;
  const prompt = `
You are a strict JSON generator.

Return ONLY valid JSON.
Do NOT include any explanation.
Do NOT flatten objects.
Do NOT convert objects into arrays.
Do NOT return key-value sequences.

CRITICAL:
- Arrays MUST contain OBJECTS
- Each object must have proper key:value pairs
- NEVER return strings like "question", "answer" separately

WRONG FORMAT (DO NOT DO THIS):
["question", "What is Node.js?", "answer", "Runtime"]

CORRECT FORMAT:
[
  {
    "question": "What is Node.js?",
    "intention": "Check understanding",
    "answer": "Node.js is a runtime..."
  }
]

Follow this EXACT schema:

{
  "matchScore": number,
  "technicalQuestions": [
    {
      "question": string,
      "intention": string,
      "answer": string
    }
  ],
  "behavioralQuestions": [
    {
      "question": string,
      "intention": string,
      "answer": string
    }
  ],
  "skillGaps": [
    {
      "skill": string,
      "severity": "low" | "medium" | "high"
    }
  ],
  "preparationPlan": [
    {
      "day": number,
      "focus": string,
      "tasks": [string]
    }
  ],
  "title": string
}

Resume:
${resume}

Self Description:
${selfDescription}

Job Description:
${jobDescription}
`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: zodToJsonSchema(interviewReportSchema)
    }
  })
  return (JSON.parse(response.text))
}

const resumeofHtml = async (htmlcontent) => {
  const browser =await puppeteer.launch({
    headless: "new",
    args: [ "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage", 
      "--disable-gpu"] 
  });
  try {
    const page = await browser.newPage();
    // await page.setViewport({ width: 1080, height: 1024 });
  await page.setContent(htmlcontent, { waitUntil: "networkidle0" });
  const pdfBuffer = await page.pdf({ format: 'A4',margin: {
            top: "20mm",
            bottom: "20mm",
            left: "15mm",
            right: "15mm"
        } });
  await browser.close();
  return pdfBuffer;
  } catch (error) {
    await browser.close();
    throw err;
  }
  
}


const generateResumePdf = async ({ resume, selfDescription, jobDescription }) => {
  const resumePdfSchemma = z.object({
    html: z.string().describe("The generated resume in HTML format which can be converted to PDF by puppeteer")
  })

  const prompt = `
You are a professional resume generator.

Return ONLY valid JSON with this structure:
{
  "html": "<!DOCTYPE html>...</html>"
}

Rules:
- No explanation
- No markdown
- Valid full HTML document
- Inline CSS styling

Resume:
${resume}

Self Description:
${selfDescription}

Job Description:
${jobDescription}

 The resume should be tailored for the given job description and should highlight the candidate's strengths and relevant experience. The HTML content should be well-formatted and structured, making it easy to read and visually appealing.
                        The content of resume should be not sound like it's generated by AI and should be as close as possible to a real human-written resume.
                        you can highlight the content using some colors or different font styles but the overall design should be simple and professional.
                        The content should be ATS friendly, i.e. it should be easily parsable by ATS systems without losing important information.
                        The resume should not be so lengthy, it should ideally be 1-2 pages long when converted to PDF. Focus on quality rather than quantity and make sure to include all the relevant information that can increase the candidate's chances of getting an interview call for the given job description.
`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: zodToJsonSchema(resumePdfSchemma)
    }
  })
  let parsed;

  try {
    parsed = JSON.parse(response.text);
  } catch (err) {
    throw new Error("Invalid JSON from AI");
  }

  if (!parsed.html) {
    throw new Error("HTML not generated");
  }
  const pdfBuffer = await resumeofHtml(parsed.html);
  return pdfBuffer;
}



module.exports = { interviewGenerateSchema, interviewReportSchema, generateResumePdf };