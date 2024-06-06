import React, { useEffect,useState } from 'react'
  import Navbar from '../../components/Navbar'
  import { useParams } from "react-router-dom";

  import { Box, useMediaQuery } from "@mui/material";
  import { useSelector } from "react-redux";
  import PostsWidget from './PostsWidget';

  import UserWidget from './UserWidgets';
  import MyPostWidget from './MyPostWidget';
  import {io} from "socket.io-client"
  // import PostsWidget from "scenes/widgets/PostsWidget";
  // import AdvertWidget from "scenes/widgets/AdvertWidget";
  // import FriendListWidget from "scenes/widgets/FriendListWidget";
import { Dashboard } from '@mui/icons-material';
  
  const HomePage = () => {
    const { userId } = useParams();
    const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
    const { _id, picturePath } = useSelector((state) => state.user);
  const { email } = useSelector((state) => state.user);



 const socket = io("http://localhost:3001")
  useEffect(()=>{
   socket.emit("join-room", email)
   socket.on("test",(data)=>{
    console.log(data,"I have got");
   })
  },[])

  

    
  
    return (
      <Box>
        <Navbar />
        <Box  paddingTop="100px"></Box>
        <Box
          width="100%"  
          padding="2rem 6%"
          display={isNonMobileScreens ? "flex" : "block"}
          gap="0.5rem"
          justifyContent="space-between"
        >
          <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
            <UserWidget userId={_id} picturePath={picturePath} />
          </Box>
          <Box
            flexBasis={isNonMobileScreens ? "42%" : undefined}
            mt={isNonMobileScreens ? undefined : "2rem"}
          >
            <MyPostWidget picturePath={picturePath} />
            <PostsWidget />
            {/* <PostsWidget userId={_id} /> */}
          </Box>
          {isNonMobileScreens && (
            <Box flexBasis="26%">
              {/* <AdvertWidget /> */}
              <Box m="2rem 0" />
              {/* <FriendListWidget userId={_id} /> */}
              <Box width="90%">
           
          </Box>
         
            </Box>
          )}
        </Box>
      </Box>
    );
  };
  
  export default HomePage;