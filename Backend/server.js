require("dotenv").config();
const connectToDB=require("./src/config/database");
const app=require("./src/app");
const {resume,selfDescription,jobDescription}=require("../Backend/src/services/temp")
const invokeGeminiAI=require("../Backend/src/services/ai.service")
const {generateInterviewReport}=require("../Backend/src/services/ai.service")
const PORT=process.env.PORT || 5000;

connectToDB();
//generateInterviewReport({resume,selfDescription,jobDescription});

app.listen(PORT,"0.0.0.0",()=>{
    console.log("server started!!");
})

//check
app.get("/health",(req,res)=>res.send("ok"));
