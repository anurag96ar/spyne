import React from "react";
import tutorialsdev from "../../Assets/tutorialsdev.png";
import Input from "../../components/Input";
import Avatar from "../../Assets/avatar.svg";
import Navbar from "../../components/Navbar";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import UserImage from "../../components/UserImage";
import { useParams } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";

import { useLocation } from 'react-router-dom';
import { instance } from "../../services/axiosInterceptor";

import { useMediaQuery } from "@mui/material";
const Dashboard = () => {
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState({});
  const [message, setMessage] = useState("");
  const [users, setUsers] = useState([]);
  const [socket, setSocket] = useState(null);
  const messageRef = useRef(null);

  const user = useSelector((state) => state.user);
  const fullName = `${user.firstName} ${user.lastName}`;
  const userProfilePic = `${user.picturePath}`;
  const userId = useSelector((state) => state.user._id);
  const [connectionData, setConnectionData] = useState([]);
  const token = useSelector((state) => state.token);
  const email = useSelector((state) => state.user.email);
  const state = useLocation();
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  useEffect(() => {

    console.log(state.state, "jayaaaaaa");
    if (state.state != null) {

      const fetchMyConverstaion = async () => {
        const response = await instance.get(
          `/users/getMyConversation/${state.state}/${userId}`,
          {
            "Content-Type": "application/json",
          }
        );

        const resData = response.data;
        
        var data = { receiver: resData[0].user, conversationId: resData[0].conversationId, }
        setMessages(data)
        setMessage("")
        fetchMessages(resData[0].conversationId, resData[0].user)
        //setConversations(resData);
      };
      fetchMyConverstaion()
    }
    const fetchConverstaion = async () => {
      const response = await instance.get(
        `/users/getconversation/${userId}`,
        {
          "Content-Type": "application/json",
        }
      );

      const resData = response.data;
     

      setConversations(resData);
      getConnection();
    };
    fetchConverstaion();
   
  }, []);

  useEffect(() => {
    setSocket(io("http://localhost:3001"));
  }, []);

  useEffect(() => {
    socket?.emit("addUser", user?._id);
    socket?.on("getUsers", (users) => {
      console.log("activeUsers :>> ", users);
    });
    socket?.on("getMessage", (data) => {
      console.log(data, "getMessage");
      setMessages((prev) => ({
        ...prev,
        messages: [
          ...prev.messages,
          { user: data.user, message: data.message },
        ],
      }));
    });

  }, [socket]);

  useEffect(() => {
    messageRef?.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages?.messages]);

  const getConnection = async () => {
    const formData = new FormData();
    formData.append("email", email);


    var data = await instance.post(
      "/users/myConnections",
      formData,
      {
        headers: {
         
          "Content-Type": "application/json",
        },
      }
    );
   
    setConnectionData(data.data);
    // var finaldata = [];
    // data.data.forEach((item, index) => {
    //   console.log(item, "ConnectionData");
    
    //   conversations.map(({ conversationId, user }) => {
    //     console.log(user, "conversations  itemmmm111");
    //     if (item._id != user.receiverId) {
    //       setConnectionData([...connectionData, item]);
    //     }
    //   });
    // });

  };

 

  const fetchMessages = async (conversationId, receiver) => {
    try {
      const response = await instance.get(
        `/users/getmessage/${conversationId}`,
        {
          params: {
            senderId: user?._id,
            receiverId: receiver?.receiverId,
          },
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const resData = response.data;
      console.log(receiver, "receiver dataaaaaa");
      setMessages({ messages: resData, receiver, conversationId });
    } catch (error) {
      // Handle errors here
      console.error("Error fetching messages:", error);
    }
  };

  const sendMessage = async (e) => {
    try {


      socket?.emit("sendMessage", {
        senderId: user?._id,
        receiverId: messages?.receiver?._id,
        message,
        conversationId: messages?.conversationId,
      });


      await instance.post(
        "/users/message",
        {
          conversationId: messages?.conversationId,
          senderId: user?._id,
          message,
          receiverId: messages?.receiver?._id,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setMessage("");
    } catch (error) {
      // Handle errors here
      console.error("Error sending message:", error);
    }
  };

  return (
    <div>
      <Navbar />
     { isNonMobileScreens?
      <div style={{ paddingTop: "98px" }} className="w-screen flex">

        <div
          style={{
            width: "25%",
            height: "100vh", // Set to 100% of the viewport height
            backgroundColor: "#e3e1e1", // Replace with your desired background color
            overflow: "auto", // or "scroll" if you prefer
          }}
        >
          <div className="flex items-center my-8 mx-14">
            <div>
              <UserImage size={60} image={userProfilePic} />

            </div>
            <div className="ml-8">
              <h3 className="text-2xl">{user?.firstName}</h3>
              <p className="text-lg font-light">My Account</p>
            </div>
          </div>
          <hr />
          <div className="mx-14 mt-10">
            <div className="text-primary text-lg">Messages</div>
            <div>
              {conversations.length > 0 ? (
                conversations.map(({ conversationId, user }) => {
                  return (
                    <div className="flex items-center py-8 border-b border-b-gray-300">
                      <div
                        className="cursor-pointer flex items-center"
                        onClick={() => fetchMessages(conversationId, user)}
                      >
                        <div>
                          <UserImage size={60} image={user?.picturePath} />

                        </div>
                        <div className="ml-6">
                          <h3 className="text-lg font-semibold">
                            {user?.firstName}
                          </h3>
                          <p className="text-sm font-light text-gray-600">
                            {user?.email}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center text-lg font-semibold mt-24">
                  No Conversations
                </div>
              )}
            </div>
          </div>
        </div>
      
        <div className="w-[50%] h-screen bg-white flex flex-col items-center">
          {messages?.receiver?.firstName && (
            <div style={{
              width: "100%",
              backgroundColor: "#e3e1e1", // Replace with your desired background color
              height: "90px",


              display: "flex", // Display as a flex container
              alignItems: "center", // Center vertically
              paddingLeft: "14px", // Left padding
              paddingRight: "14px", // Right padding
            }}>
              <div className="cursor-pointer">

                <UserImage size={60} image={messages?.receiver?.picturePath} />
              </div>
              <div className="ml-6 mr-auto">
                <h3 className="text-lg">{messages?.receiver?.firstName}</h3>
                <p className="text-sm font-light text-gray-600">
                  {messages?.receiver?.email}
                </p>
              </div>
              <div className="cursor-pointer">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="icon icon-tabler icon-tabler-phone-outgoing"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="black"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2" />
                  <line x1="15" y1="9" x2="20" y2="4" />
                  <polyline points="16 4 20 4 20 8" />
                </svg>
              </div>
            </div>
          )}
          <div className="h-[75%] w-full overflow-scroll shadow-sm">
            <div className="p-14">
              {messages?.messages?.length > 0 ? (
                messages.messages.map(({ message, user: { id } = {} }) => {
                  return (
                    <>
                      <div
                        style={{
                          backgroundColor:
                            id === user?._id ? "#bcd4f5" : "#e3e1e1",
                          maxWidth: "40%",
                          borderRadius: "8px",
                          padding: "8px",
                          marginBottom: "6px",
                          marginLeft: id === user?._id ? "auto" : "0", // Apply ml-auto conditionally
                          // Other CSS properties here
                        }}
                      >
                        {message}
                      </div>
                      <div ref={messageRef}></div>
                    </>
                  );
                })
              ) : (
                <div className="text-center text-lg font-semibold mt-24">
                  No Messages or No Conversation Selected
                </div>
              )}
            </div>
          </div>

          {/* Input Box */}
          {messages?.messages?.length > 0 ?
          <div className="p-14 w-full flex items-center">
            <Input
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-[75%]"
              inputClassName="p-4 border-0 shadow-md rounded-full bg-light focus:ring-0 focus:border-0 outline-none"
            />
            <div
              className={`ml-4 p-2 cursor-pointer bg-light rounded-full ${!message && "pointer-events-none"
                }`}
              onClick={() => sendMessage()}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="icon icon-tabler icon-tabler-send"
                width="30"
                height="30"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="#2c3e50"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <line x1="10" y1="14" x2="21" y2="3" />
                <path d="M21 3l-6.5 18a0.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a0.55 .55 0 0 1 0 -1l18 -6.5" />
              </svg>
            </div>
            <div
              className={`ml-4 p-2 cursor-pointer bg-light rounded-full ${!message && "pointer-events-none"
                }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="icon icon-tabler icon-tabler-circle-plus"
                width="30"
                height="30"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="#2c3e50"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <circle cx="12" cy="12" r="9" />
                <line x1="9" y1="12" x2="15" y2="12" />
                <line x1="12" y1="9" x2="12" y2="15" />
              </svg>
            </div>
          </div>:<div></div>}
        </div>

        {/* 3rd row */}
        <div className="w-[25%] h-screen bg-light px-8 py-16 overflow-scroll">
          <div className="text-primary text-lg">People</div>
          <div>
            {connectionData.length > 0 ? (
              connectionData.map((frnd) => {
                return (
                  <div className="flex items-center py-8 border-b border-b-gray-300">
                    <div
                      className="cursor-pointer flex items-center"

                      onClick={async () => {
                        let conversationId = "new"
                        console.log(frnd, "here connection");
                        const receiver = await conversations.map((data) => {
                        
               
                          console.log(data, "sender ID");
                

                      if(frnd._id== data.user.receiverId){
                            conversationId = data.conversationId
                          
                      }
                        });

                        fetchMessages(conversationId, frnd)
                      }}
                    >
                      <div>
                        <UserImage size={60} image={frnd.picturePath} />
                      </div>
                      <div className="ml-6">
                        <h3 className="text-lg font-semibold">
                          {frnd?.firstName}
                        </h3>
                        <p className="text-sm font-light text-gray-600">
                          {frnd?.email}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center text-lg font-semibold mt-24">
                No Conversations
              </div>
            )}
          </div>
        </div>

     
      </div>:
       <div style={{ paddingTop: "98px" }} >

       <div
         style={{
           width: "100%",
   
           backgroundColor: "#e3e1e1", // Replace with your desired background color
           overflow: "auto", // or "scroll" if you prefer
         }}
       >
         <div className="flex items-center my-8 mx-14">
           <div>
             <UserImage size={60} image={userProfilePic} />

           </div>
           <div className="ml-8">
             <h3 className="text-2xl">{user?.firstName}</h3>
             <p className="text-lg font-light">My Account</p>
           </div>
         </div>
         <hr />
         <div className="mx-14 mt-10">
           <div className="text-primary text-lg">Messages</div>
           <div>
             {conversations.length > 0 ? (
               conversations.map(({ conversationId, user }) => {
                 return (
                   <div className="flex items-center py-8 border-b border-b-gray-300">
                     <div
                       className="cursor-pointer flex items-center"
                       onClick={() => fetchMessages(conversationId, user)}
                     >
                       <div>
                         <UserImage size={60} image={user?.picturePath} />

                       </div>
                       <div className="ml-6">
                         <h3 className="text-lg font-semibold">
                           {user?.firstName}
                         </h3>
                         <p className="text-sm font-light text-gray-600">
                           {user?.email}
                         </p>
                       </div>
                     </div>
                   </div>
                 );
               })
             ) : (
               <div className="text-center text-lg font-semibold mt-24">
                 No Conversations
               </div>
             )}
           </div>
         </div>
       </div>
<br></br>
       {messages?.messages?.length > 0 ? 
       <div className="w-[100%] h-screen bg-white flex flex-col items-center">
         {messages?.receiver?.firstName && (
           <div style={{
             width: "100%",
             backgroundColor:isNonMobileScreens? "#e3e1e1":"grey", // Replace with your desired background color
             height: "90px",


             display: "flex", // Display as a flex container
             alignItems: "center", // Center vertically
             paddingLeft: "14px", // Left padding
             paddingRight: "14px", // Right padding
             paddingTop:"10px"
           }}>
             <div className="cursor-pointer">

               <UserImage size={60} image={messages?.receiver?.picturePath} />
             </div>
             <div className="ml-6 mr-auto">
               <h3 className="text-lg">{messages?.receiver?.firstName}</h3>
               <p className="text-sm font-light text-gray-600">
                 {messages?.receiver?.email}
               </p>
             </div>
             <div className="cursor-pointer">
               <svg
                 xmlns="http://www.w3.org/2000/svg"
                 class="icon icon-tabler icon-tabler-phone-outgoing"
                 width="24"
                 height="24"
                 viewBox="0 0 24 24"
                 stroke-width="1.5"
                 stroke="black"
                 fill="none"
                 stroke-linecap="round"
                 stroke-linejoin="round"
               >
                 <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                 <path d="M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2" />
                 <line x1="15" y1="9" x2="20" y2="4" />
                 <polyline points="16 4 20 4 20 8" />
               </svg>
             </div>
           </div>
         )}
      
         <div className="h-[75%] w-full overflow-scroll shadow-sm">
           <div className="p-14">
           {messages?.messages?.length > 0 ? (
               messages.messages.map(({ message, user: { id } = {} }) => {
                 return (
                   <>
                     <div
                       style={{
                         backgroundColor:
                           id === user?._id ? "#bcd4f5" : "#e3e1e1",
                         maxWidth: "40%",
                         borderRadius: "8px",
                         padding: "8px",
                         marginBottom: "6px",
                         marginLeft: id === user?._id ? "auto" : "0", // Apply ml-auto conditionally
                         // Other CSS properties here
                       }}
                     >
                       {message}
                     </div>
                     <div ref={messageRef}></div>
                   </>
                 );
               })
             ) : (
               <div >
        
               </div>
             )
             }
           </div>
         </div>

         {/* Input Box */}
         {messages?.messages?.length > 0 ?
         <div className="p-10 w-full flex items-center">
           <Input
             placeholder="Type a message..."
             value={message}
             onChange={(e) => setMessage(e.target.value)}
             className="w-[75%]"
             inputClassName="p-4 border-0 shadow-md rounded-full bg-light focus:ring-0 focus:border-0 outline-none"
           />
           <div
             className={`ml-4 p-2 cursor-pointer bg-light rounded-full ${!message && "pointer-events-none"
               }`}
             onClick={() => sendMessage()}
           >
             <svg
               xmlns="http://www.w3.org/2000/svg"
               class="icon icon-tabler icon-tabler-send"
               width="30"
               height="30"
               viewBox="0 0 24 24"
               stroke-width="1.5"
               stroke="#2c3e50"
               fill="none"
               stroke-linecap="round"
               stroke-linejoin="round"
             >
               <path stroke="none" d="M0 0h24v24H0z" fill="none" />
               <line x1="10" y1="14" x2="21" y2="3" />
               <path d="M21 3l-6.5 18a0.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a0.55 .55 0 0 1 0 -1l18 -6.5" />
             </svg>
           </div>
           <div
             className={`ml-4 p-2 cursor-pointer bg-light rounded-full ${!message && "pointer-events-none"
               }`}
           >
             <svg
               xmlns="http://www.w3.org/2000/svg"
               class="icon icon-tabler icon-tabler-circle-plus"
               width="30"
               height="30"
               viewBox="0 0 24 24"
               stroke-width="1.5"
               stroke="#2c3e50"
               fill="none"
               stroke-linecap="round"
               stroke-linejoin="round"
             >
               <path stroke="none" d="M0 0h24v24H0z" fill="none" />
               <circle cx="12" cy="12" r="9" />
               <line x1="9" y1="12" x2="15" y2="12" />
               <line x1="12" y1="9" x2="12" y2="15" />
             </svg>
           </div>
         </div>:<div></div>
         }
       </div>:<div >
        
        </div>}
       {/* 3rd row */}
       <div className="w-[100%] h-screen bg-light px-8 py-16 overflow-scroll">
         <div className="text-primary text-lg">People</div>
         <div>
           {connectionData.length > 0 ? (
             connectionData.map((frnd) => {
               return (
                 <div className="flex items-center py-8 border-b border-b-gray-300">
                   <div
                     className="cursor-pointer flex items-center"

                     onClick={async () => {
                       let conversationId = "new"
                       console.log(frnd, "here connection");
                       const receiver = await conversations.map((data) => {
                       
              
                         console.log(data, "sender ID");
               

                     if(frnd._id== data.user.receiverId){
                           conversationId = data.conversationId
                         
                     }
                       });

                       fetchMessages(conversationId, frnd)
                     }}
                   >
                     <div>
                       <UserImage size={60} image={frnd.picturePath} />
                     </div>
                     <div className="ml-6">
                       <h3 className="text-lg font-semibold">
                         {frnd?.firstName}
                       </h3>
                       <p className="text-sm font-light text-gray-600">
                         {frnd?.email}
                       </p>
                     </div>
                   </div>
                 </div>
               );
             })
           ) : (
             <div className="text-center text-lg font-semibold mt-24">
               No Conversations
             </div>
           )}
         </div>
       </div>

    
     </div>
      }
    </div>
    
    
    
  );

};

export default Dashboard;
