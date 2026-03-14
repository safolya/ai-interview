const pdfParse=require("pdf-parse");
const { interviewGenerateSchema } = require("../services/ai.services");
const interviewReportModel=require("../model/interview");

/**
 * @desc Controller for handling interview report generation and retrieval 
 * 
 */


const getInterviewReport=async(req,res)=>{
    try {

        const {interviewId}=req.params;
        const interviewReport=await interviewReportModel.findOne({_id:interviewId,user:req.user._id});

        if(!interviewReport){
            return res.status(404).json({message:"Interview report not found"});
        }

        res.status(200).json({interviewReport});

    } catch (error) {
        console.error("Error fetching interview report:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

/**
 * @desc Controller for fetching all interview reports of the authenticated user
 */

const getAllInterviewReports=async(req,res)=>{
    try {
        const interviewReports=await interviewReportModel.find({user:req.user._id}).sort({createdAt:-1}).select("-resume,-selfDescription,-jobDescription,-__v,-technicalQuestions,-behavioralQuestions,-skillGaps,-preparationPlan");
        res.status(200).json({interviewReports});
    } catch (error) {
        console.error("Error fetching interview report:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}



/**
 * @desc Controller for generating interview report based on the resume pdf , job description and self description provided by the candidate
 */


const generateInterviewReport=async(req,res)=>{
    try {
        const resume=req.file;
        const reusmeContent=await (new pdfParse.PDFParse(Uint8Array.from(resume.buffer))).getText();
        const {jobDescription,selfDescription}=req.body;

        const interviewReport=await interviewGenerateSchema({
            resume:reusmeContent.text,
            jobDescription,
            selfDescription
        })
         
        const newInterviewReport=await interviewReportModel.create({
            user:req.user._id,
            resume:reusmeContent.text,
            jobDescription,
            selfDescription,
            ...interviewReport
        })

        res.status(200).json({message:"Interview report generated successfully",interviewReport:newInterviewReport})    

    } catch (error) {
        console.error("Error generating interview report:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}




module.exports={getInterviewReport,generateInterviewReport,getAllInterviewReports};