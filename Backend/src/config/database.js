const mongoose=require("mongoose");

async function connectToDB(){
    try{
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("connected to DB")
    }
    catch(err){
        console.log("Error due to DB connectivity!!")
    }
}

module.exports=connectToDB;