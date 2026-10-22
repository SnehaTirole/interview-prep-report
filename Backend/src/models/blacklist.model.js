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
<<<<<<< HEAD
blacklistTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
=======
blacklistSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
>>>>>>> fb618b81b2738a485f3b8da2ccafa0ab0da368de

const blacklistTokenModel=mongoose.model("blacklistTokens",blacklistTokenSchema);

module.exports=blacklistTokenModel;