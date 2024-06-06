import  express  from "express";

import {
    getUser,
    getUserFriends,
    addRemoveFriend,
    connections,
    getConnectionList,
    acceptRequest,
    myConnectionList,
    deleteRequest,
    removeConnection,
    getFriendProfile,
  
    editUserDetails,
    userJobsList,
    userConversation,
    getConversation,
    userMessage,
    getMessages,
    getAllUsers,
    applyJob,
    getNofication,
    markNotificationRead,
    getJobDetails,getMyConversation, checkAppliedJob
} from "../controllers/users.js"

import { userVerification } from "../middleware/auth.js";


const router = express.Router();

/* READ */
router.get("/:id", userVerification, getUser);
router.post("/profile/:id", userVerification, editUserDetails);

router.get("/friend/:email", userVerification, getFriendProfile);

router.get("/:id/friends", userVerification, getUserFriends);


/* UPDATE */
router.patch("/:id/:friendId", userVerification, addRemoveFriend);
router.post("/connect",connections)
router.post("/myRequest",getConnectionList)
router.post("/accept",acceptRequest)
router.post("/myConnections",myConnectionList)
router.post("/delete",deleteRequest)
router.post("/unfollowUser",removeConnection)
router.post("/joblist",userJobsList)
router.post("/conversation",userConversation)
router.get("/getconversation/:userId",getConversation)
router.post("/message",userMessage)
router.get("/getmessage/:conversationId",getMessages)
router.get("/getall/:conversationId",getAllUsers)
router.post("/applyJob",applyJob)
router.get("/getNotification/:email",getNofication)
router.post("/markRead",markNotificationRead)
router.post("/getjobdetail",getJobDetails)
router.post("/checkapplied",checkAppliedJob)

router.get("/getMyConversation/:userId/:loggedInUser",getMyConversation)


export default router;