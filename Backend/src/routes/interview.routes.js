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


module.exports=router;