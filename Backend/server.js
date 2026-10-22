require("dotenv").config();
const connectToDB=require("./src/config/database");
const app=require("./src/app");
const PORT=process.env.PORT || 5000;

connectToDB();


app.listen(PORT,"0.0.0.0",()=>{
    console.log("server started!!");
})

//check
app.get("/health",(req,res)=>res.send("ok"));
