import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import User from "../models/User.js"
import otpGenerator from 'otp-generator';
import nodemailer from 'nodemailer';
import ConnectRequest from "../models/ConnectRequest.js";


 

export const register = async (req, res) => {
    try {
      const {
        firstName,
        lastName,
        email,
        mobileNumber,
        password,
        
      } = req.body;
  
      const salt = await bcrypt.genSalt();
      const passwordHash = await bcrypt.hash(password, salt);
     
      const newUser = new User({
        firstName, 
        lastName,
        mobileNumber,
        email,
        password: passwordHash,
      });
      const savedUser = await newUser.save();
      res.status(201).json({ user: savedUser });
    } catch (err) {
      res.status(500).json({ error: "Mobile Number or e-mail ID already used" });
    }
  };


  
  


  /* LOGGING IN */
export const login = async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email: email });
      if (!user) return res.status(400).json({ message: "User does not exist. Please Register" });
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: "Invalid credentials." });
  
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      delete user.password;
      res.status(200).json({ token, user });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

export   const googleLogin = async (req, res) => {
    try {
      console.log("googleLogin");
      const { email } = req.body;
      console.log(email, "req body email");
    ;
      const user = await User.findOne({ email: email, blockStatus:false });
      // if (!user) return res.status(400).json({ msg: "User does not exist. " });
      // console.log(user, "----user----------");
      if (user) {
        console.log("inside user");
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

        return res.json({
          message: "Google Login",
          token,
          user
        });
      } else {
        return res.json({ message: "Invalid User", email: email });
      }
    } catch (error) {
      console.log(error);
    }
  };

  

 


 