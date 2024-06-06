import mongoose from "mongoose";

const ConnectSchema = new mongoose.Schema(
  {
    requestTo: {
      type: String,
      required: true,
    },

    requestFrom: {
      type: String,
      required: true,
    },
   
    approved: {
      type: Boolean,
      default: false, 
    },
    
  },
  
  { timestamps: true }
);

const ConnectRequest = mongoose.model("ConnectRequest", ConnectSchema);
export default ConnectRequest;