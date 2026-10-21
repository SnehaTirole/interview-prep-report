const mongoose=require("mongoose");

const blacklistTokenSchema=new mongoose.Schema({
    token:{
        type:String,
        required:[true,"token is required to be added in blacklist"]
    },
    expiresAt:{
        type:Date,
        required:[true]
    }
},{
    timestamps:true
})

// Mongo deletes the document automatically once expiresAt passes
blacklistSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const blacklistTokenModel=mongoose.model("blacklistTokens",blacklistTokenSchema);

module.exports=blacklistTokenModel;