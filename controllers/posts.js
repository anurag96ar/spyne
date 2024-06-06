import Post from "../models/Post.js";
import User from "../models/User.js";
import ConnectRequest from "../models/ConnectRequest.js";

/* CREATE */
export const createPost = async (req, res) => {
  try {
    const { userId, email, description, picturePath } = req.body;
    const user = await User.findById(userId);
    const newPost = new Post({
      userId,
      email,
      firstName: user.firstName,
      lastName: user.lastName,
     
      description,
      
      picturePath,
      likes: {},
      comments: [],
    });
    await newPost.save();

    const post = await Post.find({isBlocked:false});
    res.status(201).json(post);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

/* READ */
export const getFeedPosts = async (req, res) => {
  try {
    const {email,page} = req.body  
    
       const connections = await ConnectRequest.find({$or: [{requestTo:email},{requestFrom:email}],approved:true});
       const emailValues = connections.map((obj) => obj.requestFrom);
       const requestTo = connections.map((obj) => obj.requestTo);
       for (const element of requestTo) {
        emailValues.push(element)
       }
    const myemail= emailValues.filter(data=>{
      return data!=email
    })
    const skip = parseInt(page)
       
       var post = await Post.find({ email: { $in: myemail }, isBlocked:false} ).limit(1).skip(skip);
       
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { userId,page } = req.params;
    const skip = parseInt(page)
    const post = await Post.find({ userId ,isBlocked:false}).limit(1).skip(skip);

    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* UPDATE */
export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    
    // Find the post by ID
    const post = await Post.findById(id);
    
    // Ensure post.likes is an object
    if (!post.likes) {
      post.likes = {};
    }

    const isLiked = post.likes[userId];

    // Like or unlike the post
    if (isLiked) {
      delete post.likes[userId];
    } else {
      post.likes[userId] = true;
    }

    // Update the post in the database
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true }
    );

    // Send the updated post as a response
    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};


export const commentPost = async (req, res) => {
  try {
    
    const { id } = req.params;
    const { userId,comment,email,firstName } = req.body;
   
    const post = await Post.findById(id);
    const newComment = {
      
      "email":email,
      "name":firstName,
      "comment":comment,
    };
   
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      
      { $push: { comments: newComment } },
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const reportPost = async (req, res) => {
  try {
    
    const { id } = req.params;
    const { email } = req.body;

    const post = await Post.findById(id);
   
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      
     
      { $push: { reportedBy: email } },
    );

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const editTilte = async (req, res) => {
  try {
    const { id } = req.params;
    const {description} = req.body
    const post = await Post.findByIdAndUpdate(id,{$set:{description}},{new:true});
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const deletepost = async (req, res) => {
  try {
    const { id } = req.params;
   
    const data = await Post.findByIdAndRemove(id);
    
    res.status(200).json(data);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};