const { GoogleGenAI } = require('@google/genai');
const {z} = require('zod');
const {zodToJsonSchema} = require('zod-to-json-schema');

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
        severity: z.enum([ "low", "medium", "high" ]).describe("The severity of the skill gap")
    })).describe("The skill gaps of the candidate that can be worked upon to improve the chances of cracking the interview"),
    preparationPlan: z.array(z.object({
        day: z.number().describe("The day number of the preparation plan"),
        focus: z.string().describe("The focus of the preparation for that day"),
        tasks: z.array(z.string()).describe("The tasks to be performed on that day to prepare for the interview")
    })).describe("A day-wise preparation plan for the candidate to crack the interview")

})


async function interviewGenerateSchema({resume,jobDescription,selfDescription}){

    const prompt=`Generate an interview report for a candidate with the following details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}`;

    const response=await ai.models.generateContent({
        model:"gemini-3-flash-preview",
        contents:prompt,
        config:{
            responseMimeType:"application/json",
            responseSchema: zodToJsonSchema(interviewReportSchema)
        }
    })
    return(JSON.parse(response.text))
}



module.exports=interviewGenerateSchema;