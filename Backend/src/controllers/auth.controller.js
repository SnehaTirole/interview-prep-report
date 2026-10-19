const userModel = require("../models/user.model");
const blacklistTokenModel=require("../models/blacklist.model");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


/**
 * @route POST /api/auth/register
 * @description register a new user,expects username, email and password from body
 * @access Public
 */
async function registerUserController(req, res) {

    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({
            success: false,
            message: "Please provide username, email and password"
        })
    }

    const isUserAlreadyExists = await userModel.findOne({
        $or: [{ username }, { email }]
    })

    if (isUserAlreadyExists) {
        if (isUserAlreadyExists.username === username) {
            return res.status(400).json({
                success: false,
                message: "Account already exists with this username"
            })
        }
        else {
            return res.status(400).json({
                success: false,
                message: "Account already exists with this email address"
            })
        }

    }

    const hash = await bcrypt.hash(password, 10);
    /* create new user now */
    const user = await userModel.create({
        username,
        email,
        password: hash
    })

    const token = jwt.sign(
        { id: user._id, username: user.username },
        process.env.SECRET_KEY,
        { expiresIn: '1d' }
    )

    res.cookie("token", token)
    res.status(201).json({
        success: true,
        message: "user registered successfully!!",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}

/** 
 * @name loginController
 * @description login a user, exprects email and password in the request body
 * @access Public
 */
async function loginController(req, res) {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
        return res.status(400).json({
            message: "Invalid email or password"
        })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(400).json({
            message: "Invalid password"
        })
    }
    const token = jwt.sign(
        { id: user._id, username: user.username },
        process.env.SECRET_KEY,
        { expiresIn: '1d' }
    )

    res.cookie("token", token);
    res.status(200).json({
        message: "user loggedIn successfully!!",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })

}

/**
 * @name logoutUserController
 * @description clear token from user cookie and add the token in blacklist
 * @access Public
 */
async function logoutUserController(req,res){
    const token=req.cookies.token;

    if(token){
        await blacklistTokenModel.create({token});   
    }

    res.clearCookie("token");

    res.status(200).json({
        message:"User logged out successfully"
    })
}

/** 
 * @name getMeController
 * @description get the current user logged in deatails,expects token in the request cookie
 * @access private
 * 
  */
async function getMeController(req,res){
    const user=await userModel.findById(req.user.id);

    res.status(200).json({
        message:"user detail fetched successfully",
        user:{
            id:user._id,
            username:user.username,
            email:user.email
        }
    })

}

module.exports = {
    registerUserController,
    loginController,
    logoutUserController,
    getMeController
}
