require("dotenv").config();
const connectToDB=require("./src/config/database");
const app=require("./src/app");
const {resume,selfDescription,jobDescription}=require("../Backend/src/services/temp")
const invokeGeminiAI=require("../Backend/src/services/ai.service")
const {generateInterviewReport}=require("../Backend/src/services/ai.service")


connectToDB();
//generateInterviewReport({resume,selfDescription,jobDescription});

app.listen(3000,()=>{
    console.log("server started!!");
})