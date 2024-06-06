import {
    ManageAccountsOutlined,
    EditOutlined,
    LocationOnOutlined,
    WorkOutlineOutlined,
  } from "@mui/icons-material";
  import { Box, Typography, Divider, useTheme } from "@mui/material";
  import UserImage from "../../components/UserImage";
  import FlexBetween from "../../components/FlexBetween";
  import WidgetWrapper from "../../components/WidgetWrapper"
  import { useSelector } from "react-redux";
  import { useEffect, useState } from "react";
  import { useNavigate } from "react-router-dom";
  import axios from 'axios';
  import { instance } from "../../services/axiosInterceptor";
  
  const UserWidget = ({ userId, picturePath }) => {
    const [user, setUser] = useState(null);
    const { palette } = useTheme();
    const navigate = useNavigate();
    const token = useSelector((state) => state.token);
    const dark = palette.neutral.dark;
    const medium = palette.neutral.medium;
    const main = palette.neutral.main;

  
    const getUser = async () => {
        try {
          
          const response = await instance.get(`/users/${userId}`);
          // const response = await axios.get(` http://localhost:3001/users/${userId}`, {
          //   headers: { Authorization: `Bearer ${token}` },
          // });
          console.log(response,"axios response");
          setUser(response.data);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };

      
  
    useEffect(() => {
      getUser();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps
  
    if (!user) {
      return null;
    }
  
    const {
      firstName,
      lastName,
      location,
      recentJob,
      friends,
    } = user;
  
    return (
      <WidgetWrapper>
        {/* FIRST ROW */}
        <FlexBetween
          gap="0.5rem"
          pb="1.1rem"
          onClick={() => navigate(`/profile/${userId}`)}
        >
          <FlexBetween gap="1rem">
            <UserImage image={picturePath} />
            <Box>
              <Typography
                variant="h4"
                color={dark}
                fontWeight="500"
                sx={{
                  "&:hover": {
                    color: palette.primary.light,
                    cursor: "pointer",
                  },
                }}
              >
                {firstName} {lastName}
              </Typography>
              {/* <Typography color={medium}>{friends.length} friends</Typography> */}
            </Box>
          </FlexBetween>
          <ManageAccountsOutlined />
        </FlexBetween>
  
        <Divider />
  
        {/* SECOND ROW */}
        <Box p="1rem 0">
          <Box display="flex" alignItems="center" gap="1rem" mb="0.5rem">
            <LocationOnOutlined fontSize="large" sx={{ color: main }} />
            <Typography color={medium}>{location}</Typography>
          </Box>
          <Box display="flex" alignItems="center" gap="1rem">
            <WorkOutlineOutlined fontSize="large" sx={{ color: main }} />
            <Typography color={medium}>{recentJob}</Typography>
          </Box>
        </Box>
  
        <Divider />
  
        
  
        <Divider />
  
      </WidgetWrapper>
    );
  };
  
  export default UserWidget;