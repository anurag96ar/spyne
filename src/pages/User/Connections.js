import React from "react";
import Navbar from "../../components/Navbar";
import { Box, Typography, Divider, useTheme, Button } from "@mui/material";
import WidgetWrapper from "../../components/WidgetWrapper";
import { useMediaQuery } from "@mui/material";
import UserWidget from "./UserWidgets";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import UserImage from "../../components/UserImage";
import { instance } from "../../services/axiosInterceptor";
function Connections() {
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const { _id, picturePath } = useSelector((state) => state.user);
  const user = useSelector((state) => state.user);
  const { palette } = useTheme();
  const dark = palette.neutral.dark;
  const medium = palette.neutral.medium;
  const main = palette.neutral.main;
  const navigate = useNavigate();
  const [userData, setUserData] = useState([]);
  const [connectionData, setConnectionData] = useState([]);

  const token = useSelector((state) => state.token);
  const email = useSelector((state) => state.user.email);

  const getRequest = async () => {
    const formData = new FormData();
    formData.append("email", email);
    console.log(formData);

    var data = await instance.post(
      "/users/myRequest",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    setUserData(data.data);
    console.log(data);
  };

  const getConnection = async () => {
    const formData = new FormData();
    formData.append("email", email);
    console.log(formData);

    var data = await instance.post(
      "/users/myConnections",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    setConnectionData(data.data);
    console.log(data);
  };

  useEffect(() => {
    getRequest();
    getConnection();
  }, []);

  const handleClick = async (data) => {
    // Handle the click event here, for example:
    console.log(`Clicked item with data: ${data}`);
    const formData = new FormData();
    formData.append("requestFrom", data);
    console.log(formData);

    try {
      const response = await instance.post(
        "/users/accept",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const connect = response.data;
      // window.location.reload();
      // this.setConnectionData()
      getRequest();
      getConnection();

      console.log(connect);
    } catch (error) {
      // Handle errors here
      console.error("Error uploading post:", error);
    }
  };

  const handleDelete = async (data) => {
    // Handle the click event here, for example:
    console.log(`Clicked item with data: ${data}`);
    const formData = new FormData();
    formData.append("requestFrom", data);
    console.log(formData);

    try {
      const response = await instance.post(
        "/users/delete",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const connect = response.data;
      // window.location.reload();
      // this.setConnectionData()
      getRequest();


      console.log(connect);
    } catch (error) {
      // Handle errors here
      console.error("Error uploading post:", error);
    }
  };

  return (
    <Box>
      <Navbar />
      <Box
        paddingTop="120px"
        flexBasis={isNonMobileScreens ? "100%" : undefined}
      >
        <WidgetWrapper
          width={isNonMobileScreens ? "50%" : "80%"}
          style={{ margin: "0 auto", textAlign: "center" }}
        >
          <Typography variant="h5" style={{ textAlign: "left" }}>
            {" "}
            Invites
          </Typography>
          <Typography
            onClick={() => navigate("/allInvites")}
            variant="h6"
            padding="10px"
            style={{ textAlign: "right", cursor: "pointer" }}
          >
            {" "}
            See All ({userData.length})
          </Typography>
          <Divider />
          {userData.length < 1 ? (
            <Typography
              variant="h5"
              padding="10px"
              style={{ textAlign: "center" }}
            >
              {" "}
              No Invites
            </Typography>
          ) : (
            <Box></Box>
          )}
          {userData.map((user) => (
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  paddingTop: "10px",
                }}
              >
                {/* Image holder */}
                <div
                  style={{
                    width: isNonMobileScreens ? "80px" : "40px",
                    height: isNonMobileScreens ? "80px" : "40px",
                    backgroundColor: "lightgray",
                    borderRadius: "50px",
                  }}
                >
                  <UserImage size={isNonMobileScreens ? "80px" : "40px"} image={user.picturePath} />
                </div>
                {/* Text */}


                <div style={{ marginLeft: "20px", display:"flex",flexDirection: "column", alignItems: "flex-start"
    }}>
                  <Typography variant="h4" >
                    {user.firstName} {user.lastName}
                  </Typography>
                  <Typography color={medium}>{user.recentJob}</Typography>
                </div>
                {/* Accept button */}
                {isNonMobileScreens ?

                  <Button
                    onClick={() => handleClick(user.email)}
                    variant="contained"
                    color="primary"
                    style={{ marginLeft: "auto", borderRadius: "50px" }}
                  >
                    Accept
                  </Button> : <div></div>}
                {isNonMobileScreens ?
                  <Button
                    onClick={() => handleDelete(user.email)}
                    variant="contained"
                    color="primary"
                    style={{ marginLeft: "20px", borderRadius: "50px" }}
                  >
                    Deny
                  </Button> : <div></div>}

              </div>

              {!isNonMobileScreens ?

                <Button
                  onClick={() => handleClick(user.email)}
                  variant="contained"
                  color="primary"
                  style={{ marginLeft: "auto", marginTop: "10px", borderRadius: "50px" }}
                >
                  Accept
                </Button> : <div></div>}
              {!isNonMobileScreens ?
                <Button
                  onClick={() => handleDelete(user.email)}
                  variant="contained"
                  color="primary"
                  style={{ marginLeft: "10px", marginTop: "10px", borderRadius: "50px" }}
                >
                  Deny
                </Button> : <div></div>}


            </div>
          ))}
        </WidgetWrapper>
        <Box m="2rem 0" />
        {/* <FriendListWidget userId={userId} /> */}
      </Box>

      <Box flexBasis={isNonMobileScreens ? "100%" : undefined}>
        <WidgetWrapper
          width={isNonMobileScreens ? "50%" : "80%"}
          style={{ margin: "0 auto", textAlign: "center" }}
        >
          <Typography variant="h5" style={{ textAlign: "left" }}>
            {" "}
            Connections
          </Typography>
          <Typography
            onClick={() => navigate("/myConnections")}
            variant="h6"
            padding="10px"
            style={{ textAlign: "right", cursor: "pointer" }}
          >
            {" "}
            See All ({connectionData.length})
          </Typography>
          <Divider />
          {connectionData.length < 1 ? (
            <Typography
              variant="h5"
              padding="10px"
              style={{ textAlign: "center" }}
            >
              {" "}
              No Connections
            </Typography>
          ) : (
            <Box></Box>
          )}
          {connectionData.map((user) => (
            <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                paddingTop: "10px",
              }}
            >
              {/* Image holder */}
              <div
                style={{
                  width: isNonMobileScreens ? "80px" : "40px",
                  height: isNonMobileScreens ? "80px" : "40px",
                  backgroundColor: "lightgray",
                  borderRadius: "50px",
                }}
              >
                <UserImage size={isNonMobileScreens ? "80px" : "40px"} image={user.picturePath} />
              </div>
              {/* Text */}
              <div style={{ marginLeft: "20px",display:"flex",flexDirection: "column", alignItems: "flex-start" }}>
                <Typography variant="h5">
                  {user.firstName} {user.lastName}
                </Typography>
                <Typography  color={medium}>{user.recentJob}</Typography>
              </div>
              {/* Accept button */}
              {isNonMobileScreens ?
              <Button
                variant="contained"
                color="primary"
                style={{ marginLeft: "auto", borderRadius: "50px" }}
                onClick={() => navigate("/chat", { state: user._id })} >
                Message
              </Button>:<div></div>
              }
            </div>
             {!isNonMobileScreens ?
              <div style={{ marginLeft: "60px",display:"flex",flexDirection: "column", alignItems: "flex-start" }}>
              <Button
                variant="contained"
                color="primary"
                style={{ marginTop: "10px", borderRadius: "50px" }}
                onClick={() => navigate("/chat", { state: user._id })} >
                Message
              </Button></div>:<div></div>
              }</div>
          ))}
        </WidgetWrapper>
        <Box m="2rem 0" />
        {/* <FriendListWidget userId={userId} /> */}
      </Box>
    </Box >
  );
}

export default Connections;
