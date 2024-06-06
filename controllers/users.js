import User from "../models/User.js";
import ConnectRequest from "../models/ConnectRequest.js";


let io;
export const initialiseSocket = (ao) => {
  io = ao;
};

/* READ */
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const editUserDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, mobileNumber } = req.body;

    const user = await User.findByIdAndUpdate(
      id,
      { $set: { email, mobileNumber, firstName, lastName } },
      { new: true }
    );
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const uploadProfile = async (req, res) => {
  try {
    const { email, picturePath } = req.body;

    const user = await User.findOneAndUpdate(
      { email: email },
      { picturePath: picturePath }
    );
    res.status(201).json(user);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

export const getFriendProfile = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.find({ email: email });
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );
    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* UPDATE */
export const addRemoveFriend = async (req, res) => {
  try {
    const { id, friendId } = req.params;
    const user = await User.findById(id);
    const friend = await User.findById(friendId);

    if (user.friends.includes(friendId)) {
      user.friends = user.friends.filter((id) => id !== friendId);
      friend.friends = friend.friends.filter((id) => id !== id);
    } else {
      user.friends.push(friendId);
      friend.friends.push(id);
    }
    await user.save();
    await friend.save();

    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );

    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const searchUser = async (req, res) => {
  const { searchData } = req.body;
  const usersList = await User.find({ firstName: { $regex: searchData } });
  if (usersList.length > 0) {
    res.json(usersList);
  } else {
    res.json({ message: "User not found" });
  }
};

export const connections = async (req, res) => {
  try {
    const { requestTo, requestFrom } = req.body;

    const newRequest = new ConnectRequest({
      requestTo: requestTo,
      requestFrom: requestFrom,
    });

    io.to(requestTo).emit("new-connection", { message: "Success" });
    await newRequest.save();

    res.status(201).json(newRequest);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

export const getConnectionList = async (req, res) => {
  try {
    const { email } = req.body;
    const connections = await ConnectRequest.find({
      requestTo: email,
      approved: false,
    });
    const emailValues = connections.map((obj) => obj.requestFrom);

    var data = await User.find({ email: { $in: emailValues } });

    res.status(201).json(data);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

export const acceptRequest = async (req, res) => {
  try {
    const { requestFrom } = req.body;

    const acceptRequest = await ConnectRequest.findOneAndUpdate(
      { requestFrom: requestFrom },
      { approved: true }
    );

    res.status(201).json(acceptRequest);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

export const deleteRequest = async (req, res) => {
  try {
    const { requestFrom } = req.body;

    const deleteRequest = await ConnectRequest.findOneAndDelete({
      requestFrom: requestFrom,
    });

    res.status(201).json(deleteRequest);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

export const myConnectionList = async (req, res) => {
  try {
    const { email } = req.body;
    const connections = await ConnectRequest.find({
      $or: [{ requestTo: email }, { requestFrom: email }],
      approved: true,
    });
    const emailValues = connections.map((obj) => obj.requestFrom);
    const requestTo = connections.map((obj) => obj.requestTo);
    for (const element of requestTo) {
      emailValues.push(element);
    }
    const myemail = emailValues.filter((data) => {
      return data != email;
    });

    var data = await User.find({ email: { $in: myemail } });

    res.status(201).json(data);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

export const removeConnection = async (req, res) => {
  try {
    const { requestFrom } = req.body;

    const connections = await ConnectRequest.findOneAndRemove({
      $or: [{ requestTo: requestFrom }, { requestFrom: requestFrom }],
      approved: true,
    });
    res.status(201).json(connections);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

export const userJobsList = async (req, res) => {
  const jobsList = await Job.find({});

  res.json(jobsList);
};

export const applyJob = async (req, res) => {
  try {
    const { jobId, appliedBy, jobTitle } = req.body;

    const jobsApplied = new JobModel({
      jobId: jobId,
      appliedBy: appliedBy,
      jobTitle: jobTitle,
    });
    await jobsApplied.save();
    res.status(200).send("Jobs applied successfully");
  } catch (error) {
    console.log(error, "Error");
  }
};

export const userConversation = async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;
    const newCoversation = new Conversations({
      members: [senderId, receiverId],
    });

    await newCoversation.save();
    res.status(200).send("Conversation created successfully");
  } catch (error) {
    console.log(error, "Error");
  }
};

export const getConversation = async (req, res) => {
  try {
    const userId = req.params.userId;
    const conversations = await Conversations.find({
      members: { $in: [userId] },
    });
    const conversationUserData = Promise.all(
      conversations.map(async (conversation) => {
        const receiverId = conversation.members.find(
          (member) => member !== userId
        );
        const user = await User.findById(receiverId);

        return {
          user: {
            receiverId: user._id,
            email: user.email,
            firstName: user.firstName,
            picturePath: user.picturePath,
          },
          conversationId: conversation._id,
        };
      })
    );
    res.status(200).json(await conversationUserData);
  } catch (error) {
    console.log(error, "Error");
  }
};

export const userMessage = async (req, res) => {
  try {
    const { conversationId, senderId, message, receiverId = "" } = req.body;

    if (!senderId || !message)
      return res.status(400).send("Please fill all required fields");

    if (conversationId === "new") {
      const newCoversation = new Conversations({
        members: [senderId, receiverId],
      });
      await newCoversation.save();
      console.log(newCoversation, "Jayuuuuu123");
      const newMessage = new Messages({
        conversationId: newCoversation._id,
        senderId,
        message,
      });
      await newMessage.save();
      console.log(newMessage, "Jayuuuuu123");
      return res.status(200).send("Message sent successfully");
    } else if (!conversationId && !receiverId) {
      return res.status(400).send("Please fill all required fields");
    }
    const newMessage = new Messages({ conversationId, senderId, message });
    await newMessage.save();
    res.status(200).send("Message sent successfully");
  } catch (error) {
    console.log(error, "Error");
  }
};

export const getMessages = async (req, res) => {
  try {
    const checkMessages = async (conversationId) => {
      const messages = await Messages.find({ conversationId });
      const messageUserData = Promise.all(
        messages.map(async (message) => {
          const user = await User.findById(message.senderId);
          return {
            user: {
              id: user._id,
              email: user.email,
              firstName: user.firstName,
            },
            message: message.message,
          };
        })
      );
      res.status(200).json(await messageUserData);
    };
    const conversationId = req.params.conversationId;
    if (conversationId === "new") {
      const checkConversation = await Conversations.find({
        members: { $all: [req.query.senderId, req.query.receiverId] },
      });
      if (checkConversation.length > 0) {
        checkMessages(checkConversation[0]._id);
      } else {
        return res.status(200).json([]);
      }
    } else {
      checkMessages(conversationId);
    }
  } catch (error) {
    console.log("Error", error);
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const userId = req.params.userId;
    const users = await User.find({ _id: { $ne: userId } });
    const usersData = Promise.all(
      users.map(async (user) => {
        return {
          user: {
            email: user.email,
            firstName: user.firstName,
            receiverId: user._id,
          },
        };
      })
    );
    res.status(200).json(await usersData);
  } catch (error) {
    console.log("Error", error);
  }
};

export const getNofication = async (req, res) => {
  const { email } = req.params;

  console.log(email, "email in params");
  const notification = await Notification.find({
    "readBy.email": { $ne: email },
  });

  res.json(notification);
};

export const markNotificationRead = async (req, res) => {
  try {
    const { email, id } = req.body;

    console.log(email, id, "email and ID is here");

    const updatedNotification = await Notification.findByIdAndUpdate(
      id,

      { readBy: [{ isread: true, email: email }] },
      { new: true }
    );

    res.status(200).json(updatedNotification);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getJobDetails = async (req, res) => {
  const { jobId } = req.body;
  console.log(jobId, "job Id Id ID");
  const jobDetails = await Job.findById(jobId);
  res.status(200).json(jobDetails);
};

export const getMyConversation = async (req, res) => {
  try {
    const userId = req.params.userId;
    const loggedInUser = req.params.loggedInUser;
    let conversationUserData = [];
    const conversations = await Conversations.find({
      members: { $in: [userId] },
    });

    if (conversations.length > 0) {
      console.log(conversations, "conversations");
      conversationUserData = Promise.all(
        conversations.map(async (conversation) => {
          const receiverId = conversation.members.find(
            (member) => member !== userId
          );
          const user = await User.findById(userId);

          return {
            user: {
              receiverId: receiverId,
              email: user.email,
              firstName: user.firstName,
              picturePath: user.picturePath,
            },
            conversationId: conversation._id,
          };
        })
      );
    } else {
      const newCoversation = new Conversations({
        members: [loggedInUser, userId],
      });

      await newCoversation.save();
      const conversations = await Conversations.find({
        members: { $in: [userId] },
      });
    }
    res.status(200).json(await conversationUserData);
    conversationUserData = Promise.all(
      conversations.map(async (conversation) => {
        const receiverId = conversation.members.find(
          (member) => member !== userId
        );
        const user = await User.findById(userId);

        return {
          user: {
            receiverId: receiverId,
            email: user.email,
            firstName: user.firstName,
            picturePath: user.picturePath,
          },
          conversationId: conversation._id,
        };
      })
    );
  } catch (error) {
    console.log(error, "Error");
  }
};

export const checkAppliedJob = async (req, res) => {
  const { appliedBy, jobId } = req.body;

  console.log(appliedBy, "and", jobId, "Here it is");

  const appliedJob = await JobModel.find({
    appliedBy: appliedBy,
    jobId: jobId,
  });

  console.log(appliedJob, "Applied details");

  res.status(200).json(appliedJob);
};
