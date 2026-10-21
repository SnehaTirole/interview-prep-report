const express=require("express");
const authMiddleware=require("../middlewares/auth.middleware")
const interviewRouter=express.Router();
const interviewController=require("../controllers/interview.controller")
const upload=require("../middlewares/file.middleware")
const geminiRateLimit=require("../middlewares/geminiRateLimit.middleware")
/** 
 * @route POST /api/interview
 * @description generate new interview report on the basis of user self descrition, resume pdf and job description
 * @access private
 */
interviewRouter.post("/",authMiddleware.authUser,geminiRateLimit,upload.single('resume'),upload.validatePdfSignature,interviewController.generateInterviewReportController)

/** 
 * @route GET /api/interview/report/:interviewId
 * @description get interview report by interviewId
 * @access private
  */
interviewRouter.get("/report/:interviewId",authMiddleware.authUser,interviewController.getInterviewReportByIdController)

/** 
 *@route GET  /api/interview/
 *@description get interview reports of logged in user.
 *@access private
*/
interviewRouter.get("/",authMiddleware.authUser,interviewController.getAllInterview)

/** 
 * @route POST /api/interview/resume/pdf
 * @description generate resume pdf based on user self description,resume and job description
 * @access private
 */
interviewRouter.post("/resume/pdf/:interviewReportId",authMiddleware.authUser,geminiRateLimit,interviewController.generateResumePdfController)

module.exports=interviewRouter;
