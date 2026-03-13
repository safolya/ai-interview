const pdfParse=require("pdf-parse");
const { interviewGenerateSchema } = require("../services/ai.services");
const interviewReportModel=require("../model/interview");
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




module.exports={generateInterviewReport}