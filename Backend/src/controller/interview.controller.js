const pdfParse = require("pdf-parse");
const { interviewGenerateSchema,interviewReportSchema,generateResumePdf } = require("../services/ai.services");
const interviewReportModel = require("../model/interview");
const {normalizeArray,sanitizeData} = require("../utils/ai.Normalize")

/**
 * @desc Controller for handling interview report generation and retrieval 
 * 
 */


const getInterviewReport = async (req, res) => {
    try {

        const { interviewId } = req.params;
        const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id });

        if (!interviewReport) {
            return res.status(404).json({ message: "Interview report not found" });
        }

        res.status(200).json({ interviewReport });

    } catch (error) {
        console.error("Error fetching interview report:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

/**
 * @desc Controller for fetching all interview reports of the authenticated user
 */

const getAllInterviewReports = async (req, res) => {
    try {
        const interviewReports = await interviewReportModel.find({ user: req.user.id }).sort({ createdAt: -1 }).select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan");
        res.status(200).json({ interviewReports });
    } catch (error) {
        console.error("Error fetching interview report:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// async function getAllInterviewReportsController(req, res) {
//     const interviewReports = await interviewReportModel.find({ user: req.user.id }).sort({ createdAt: -1 }).select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan")

//     res.status(200).json({
//         message: "Interview reports fetched successfully.",
//         interviewReports
//     })
// }



/**
 * @desc Controller for generating interview report based on the resume pdf , job description and self description provided by the candidate
 */


const generateInterviewReport = async (req, res) => {
    try {
        const resume = req.file;
        const reusmeContent = await (new pdfParse.PDFParse(Uint8Array.from(resume.buffer))).getText();
        // const reusmeContent = await pdfParse(resume.buffer);
        console.log(reusmeContent.text);
        const { jobDescription, selfDescription } = req.body;

        console.log(interviewGenerateSchema);

        const interviewReport = await interviewGenerateSchema({
            resume: reusmeContent.text,
            jobDescription,
            selfDescription
        })

        console.log(interviewReport);

        interviewReport.technicalQuestions = normalizeArray(interviewReport.technicalQuestions, "qa");
        interviewReport.behavioralQuestions = normalizeArray(interviewReport.behavioralQuestions, "qa");
        interviewReport.skillGaps = normalizeArray(interviewReport.skillGaps, "skill");
        interviewReport.preparationPlan = normalizeArray(interviewReport.preparationPlan, "plan");
        interviewReport.title = interviewReport.title || "AI Interview Report";

        // interviewReport = sanitizeData(interviewReport);

         const parsed = interviewReportSchema.safeParse(interviewReport);

        if (!parsed.success) {
            console.error("Zod Validation Error:", parsed.error);
            return res.status(400).json({
                message: "Invalid AI response structure",
                error: parsed.error
            });
        }


        const newInterviewReport = await interviewReportModel.create({
            user: req.user.id,
            resume: reusmeContent.text,
            jobDescription,
            selfDescription,
            ...interviewReport
        })

        res.status(200).json({ message: "Interview report generated successfully", interviewReport: newInterviewReport })

    } catch (error) {
        console.error("Error generating interview report:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

/**
 * @desc Function to generate resume pdf from the resume content , self description and job description provided by the candidate
 * This function uses the generateResumePdf function from the ai.services to generate a resume in HTML format and then converts it to PDF using puppeteer
 * The generated PDF buffer is then returned as a response with the appropriate headers for downloading the file
 * 
 * @param {Object} req - Express request object containing the resume content, self description and job description in the body
 * @param {Object} res - Express response object used to send the generated PDF file as a response
 * @returns {Buffer} - The generated resume PDF buffer
 */

  const generateResumePdfController=async(req,res)=>{
    try {
        const{interviewReportId}=req.params;
        const interviewReport=await interviewReportModel.findOne({_id:interviewReportId,user:req.user.id});

        if(!interviewReport){
            return res.status(404).json({message:"Interview report not found"});
        }

        const{resume,selfDescription,jobDescription}=interviewReport;

        const pdfBuffer=await generateResumePdf({resume,selfDescription,jobDescription});

        res.set({
            "Content-Type":"application/pdf",
            "Content-Disposition":`attachment; filename="${interviewReport.title.replace(/\s+/g,"_")}_Resume.pdf"`
        })
        res.send(pdfBuffer);
    } catch (error) {
        console.error("Error generating resume PDF:", error);
        res.status(500).json({ message: "Internal server error" });
    }
  }


module.exports = { getInterviewReport, generateInterviewReport, getAllInterviewReports, generateResumePdfController };