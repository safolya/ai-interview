const{Router}=require("express");
const interviewController=require("../controller/interview.controller");
const authMiddleware=require("../middleware/auth.middleware");
const upload=require("../middleware/file.middleware");
const router=Router();

/**
 * @route POST /api/interview/
 * @desc Generate interview report based on the resume pdf , job description and self description provided by the candidate
 * @access Private (Requires authentication)
 */
  
   router.post("/",authMiddleware,upload.single("resume"),interviewController.generateInterviewReport);

   /**
    * @route GET /api/interview/report/interviewId
    * @desc Get the interview report for a specific interview ID
    * @access Private (Requires authentication)
    */
   router.get("/report/:interviewId",authMiddleware,interviewController.getInterviewReport);

   /**
    * @route GET /api/interview/
    * @desc Get all interview reports for the authenticated user
    * @access Private (Requires authentication)
    */
    router.get("/",authMiddleware,interviewController.getAllInterviewReports);

    /**
     * @route POST /api/interview/resume/pdf/:interviewReportId
     * @desc Generate a resume PDF based on the resume content, self description and job description provided by the candidate
     * @access Private (Requires authentication)
     */

    router.post("/resume/pdf/:interviewReportId",authMiddleware,interviewController.generateResumePdfController);

module.exports=router;