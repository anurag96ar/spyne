import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  name: String,
  email: String,
  comment:String
});

const postSchema = mongoose.Schema(
  {

    userId: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },

   
    
    description: String,
    picturePath: String,
   
    likes: {
      type: Map,
      of: Boolean,
    },
    comments: [
      {
        email: String,
        name: String,
        comment: String,
        createdAt: {
          type: Date,
          default: Date.now,
          get: function (value) {
            return value.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            });
          }
        }
      },
    ],
    
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

export default Post;