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

const resumeofHtml=async(htmlcontent)=>{
  const browser=puppeteer.launch();
  const page=(await browser).newPage();
  (await page).setContent(htmlcontent,{ waitUntil: 'networkidle0' });
  const pdfBuffer=(await page).pdf({format:'A4'});
  (await browser).close();
  return pdfBuffer;
}


const generateResumePdf=async({resume,selfDescription,jobDescription})=>{
     const resumePdfSchemma=z.object({
      html:z.string().describe("The generated resume in HTML format which can be converted to PDF by puppeteer")
     })

     const prompt =`Generate a resume in HTML format for a candidate based on the following details:
Resume: ${resume}
Self Description: ${selfDescription}
Job Description: ${jobDescription}
 the response should be JSON object with a single field "html" which contains the generated resume in HTML format. The HTML should be well-structured and can be directly converted to PDF using libraries like puppeteer. Do not include any explanations or additional text, only return the JSON object with the HTML content.`;

     const response=await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(resumePdfSchemma)
        }
     })
     const htmlcontent = JSON.parse(response.text)
     const pdfBuffer = await resumeofHtml(htmlcontent.html);
     return pdfBuffer;
}



module.exports = { interviewGenerateSchema,interviewReportSchema,generateResumePdf };