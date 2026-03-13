const userModel=require("../model/user.model");
const blacklistModel=require("../model/blacklist.model");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");

/**
 * @name registerUser
 * @description Registers a new user with the provided username, email, and password.
 * @access Public
 */
const registerUser=async(req,res)=>{
    try {
        const { username, email, password } = req.body;

        if(!username || !email || !password){
            return res.status(400).json({ message: 'All fields are required' });
        }

        const existingUser = await userModel.findOne({ $or: [{ username }, { email }] });

        if (existingUser) {
            return res.status(400).json({ message: 'Username or email already exists' });
        }

        const hash=await bcrypt.hash(password,10);

        const newUser = await userModel.create({ username, email, password: hash });

        const token=jwt.sign({id:newUser._id},process.env.JWT_SECRET_KEY,{expiresIn:"1d"});

        res.cookie("token", token)

        res.status(201).json({ message: 'User registered successfully', user: {
            id: newUser._id,
            username: newUser.username,
            email: newUser.email
        } });


    } catch (error) {
        res.status(500).json({ message: 'Error registering user' });
    }
}

/**
 * @name loginUser
 * @description Authenticates a user with the provided email and password, and returns a JWT token if successful.
 * @access Public
 */

const loginUser=async(req,res)=>{
    try {
        const { email, password } = req.body;

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });

        res.cookie("token", token);

        res.status(200).json({ message: 'User logged in successfully', user: {
            id: user._id,
            username: user.username,
            email: user.email
        } });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in user', error: error.message });
    }
}

/**
 * @name logoutUser
 * @description Logs out a user by blacklisting the JWT token.
 * @access Public
 */

 const logoutUser=async(req,res)=>{
    try {
        const token=req.cookies.token;
        if(!token){
            return res.status(400).json({message:"No token provided"});
        }
        await blacklistModel.create({token});
        res.clearCookie("token");
        res.status(200).json({message:"User logged out successfully"});
    } catch (error) {
        res.status(500).json({message:"Error logging out user", error:error.message});
    }
 }

 /**
  * @name getMe
  * @description Retrieves the authenticated user's information based on the JWT token.
  * @access Public
  */

    const getMe=async(req,res)=>{
        try {
            const user = await userModel.findById(req.user.id)
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.status(200).json({message: "User information retrieved successfully", user:{
                id: user._id,
                username: user.username,
                email: user.email
            } });
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving user information', error: error.message });
        }
    }


module.exports={registerUser, loginUser, logoutUser, getMe};