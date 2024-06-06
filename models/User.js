import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      min: 2,
      max: 50,
    },
    lastName: {
      type: String,
      required: true,
      min: 2,
      max: 50,
    },
    mobileNumber: {
      type: String,
      required: true,
      max: 50,
      unique: true,
    },
     email: {
      type: String,
      required: true,
      max: 50,
      unique: true,
    }, 
    password: {
      type: String,
      required: true,
      min: 5,
    },
  }
  
);

const User = mongoose.model("User", UserSchema);
export default User;