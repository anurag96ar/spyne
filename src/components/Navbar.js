import { useEffect, useState } from "react";
import {
  Box,
  IconButton,
  InputBase,
  Typography,
  Select,
  MenuItem,
  FormControl,
  useTheme,
  useMediaQuery,
  AppBar,
} from "@mui/material";
import {
  Search,
  Message,
  DarkMode,
  LightMode,
  Notifications,
  Help,
  Menu,
  Close,
  Work,
  Group,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { setMode, setLogout } from "../state/state";
import { useNavigate } from "react-router-dom";
import FlexBetween from "./FlexBetween";

import ChatIcon from "@mui/icons-material/Chat";
import io from "socket.io-client";
import { Badge, Popover, List, ListItem, ListItemText } from "@mui/material";
import axios from "axios";
import moment from "moment";
import { instance } from "../services/axiosInterceptor";

const Navbar = () => {
  const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const [searchData, setSearchData] = useState("");
  const [connectionCount, setConnectionCount] = useState(0);
  const [jobCount, setJobCount] = useState(0);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const [jobData, setJobData] = useState([]);
  const isNotificationPopoverOpen = Boolean(notificationAnchorEl);

  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;
  const dark = theme.palette.neutral.dark;
  const background = theme.palette.background.default;
  const primaryLight = theme.palette.primary.light;
  const alt = theme.palette.background.alt;
  const { email } = useSelector((state) => state.user);
  const { _id } = useSelector((state) => state.user);

  const fullName = `${user.firstName} ${user.lastName}`;

  const onChange = (event) => {
    setSearchData(event.target.value);
  };
  const socket = io("http://localhost:3001");

  useEffect(() => {
    socket.emit("join-room", email);
    socket.on("test", (data) => {});
  }, []);

  useEffect(()=>{
    handleSaveNotification()
  },[])

  useEffect(() => {
    socket.on("new-connection", (data) => {
      if (data.message === `Success`) {
        setConnectionCount((count) => Math.ceil((count + 1) / 2));
      }
    });
  }, []);

  const handleSaveNotification = async () => {
    const response = await instance.get(
      `/users/getNotification/${email}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    setJobCount(response.data.length);
    setJobData(response.data);

  };


  const handleReadNotification = async (id,jobId) => {
    const formData = new FormData();
    formData.append("email", email);
    formData.append("id", id);
    
    const response = await instance.post(
      `/users/markRead`,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    handleSaveNotification()
    localStorage.setItem("jobId", jobId);
     

    navigate("/jobapply")
    window.location.reload();
   
  };

  useEffect(() => {
    socket.on("new-job", (data) => {
      if (data.message === `Success`) {
        const newJobData = data.job;
        // setJobData((prevJobData) => [...prevJobData, newJobData]);
        // setJobCount((count) => Math.ceil((count + 1) / 2));
        handleSaveNotification();
      }
    });
  }, []);

  console.log(jobData, "Job Data here");

  console.log(jobCount, ">>>> Job Count");

  const handleNotification = async () => {
    setConnectionCount(0);
    navigate("/connections");
  };

  const handleJobNotification = async () => {
    setJobCount(0);
  };

  const handleNotificationClick = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };

  function TimeAgo({ timestamp }) {
    // Convert the timestamp to a moment object
    const time = moment(timestamp);

    // Calculate the time difference from now
    const timeDifference = moment.duration(moment().diff(time));

    // Get the hours and minutes from the time difference
    const hours = timeDifference.hours();
    const minutes = timeDifference.minutes();

    // Create the time ago string
    let timeAgo = "";

    if (hours > 0) {
      timeAgo = `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
    } else if (minutes > 0) {
      timeAgo = `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
    } else {
      timeAgo = "Just now";
    }

    return <p>{timeAgo}</p>;
  }

  return (
    <AppBar>
      <FlexBetween
        position="sticky"
        padding="1rem 6%"
        backgroundColor="#088395"
      >
        <FlexBetween position="sticky" gap="1.75rem">
          <img
            src={"/worlinklogo.png"}
            alt="Sociopedia Logo"
            onClick={() => navigate("/feeds")}
            style={{
              width: "clamp(2rem, 4rem, 6rem)",
              cursor: "pointer",
              borderRadius: "50%",
            }}
          />
          {isNonMobileScreens && (
            <FlexBetween
              backgroundColor={neutralLight}
              borderRadius="9px"
              gap="3rem"
              padding="0.1rem 1.5rem"
            >
              <InputBase
                placeholder="Search..."
                sx={{ marginRight: "1rem" }} // Add right margin here
                onChange={onChange}
              />
              <IconButton>
                <Search
                  onClick={() => navigate("/search", { state: searchData })}
                />
              </IconButton>
            </FlexBetween>
          )}
        </FlexBetween>

        {/* DESKTOP NAV */}
        {isNonMobileScreens ? (
          <FlexBetween gap="2rem">
            <Badge badgeContent={connectionCount} color="secondary">
              <Group
                onClick={handleNotification}
                sx={{ fontSize: "25px", color: "white", cursor: "pointer" }}
              />
            </Badge>

            <Message
              onClick={() => navigate("/chat")}
              sx={{ fontSize: "25px", color: "white", cursor: "pointer" }}
            />

            <Work
              onClick={() => navigate("/jobLists")}
              sx={{ fontSize: "25px", color: "white", cursor: "pointer" }}
            />

            <Badge badgeContent={jobCount} color="secondary">
              <Notifications
                sx={{ fontSize: "25px", color: "white", cursor: "pointer" }}
                onClick={(e) => {
                  handleNotificationClick(e);
                  handleJobNotification(e);
                }}
              />
            </Badge>

            <FormControl variant="standard" value={fullName}>
              <Select
                value={fullName}
                sx={{
                  backgroundColor: neutralLight,
                  width: "150px",
                  borderRadius: "0.25rem",
                  p: "0.25rem 1rem",
                  "& .MuiSvgIcon-root": {
                    pr: "0.25rem",
                    width: "3rem",
                  },
                  "& .MuiSelect-select:focus": {
                    backgroundColor: neutralLight,
                  },
                }}
                input={<InputBase />}
              >
                <MenuItem value={fullName}>
                  <Typography>{fullName}</Typography>
                </MenuItem>
                <MenuItem onClick={() => dispatch(setLogout())}>
                  Log Out
                </MenuItem>
              </Select>
            </FormControl>
          </FlexBetween>
        ) : (
          <IconButton
            onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
          >
            <Menu />
          </IconButton>
        )}

        {/* MOBILE NAV */}
        {!isNonMobileScreens && isMobileMenuToggled && (
          <Box
            position="fixed"
            right="0"
            bottom="0"
            height="100%"
            zIndex="10"
            maxWidth="500px"
            minWidth="300px"
            backgroundColor={background}
          >
            {/* CLOSE ICON */}
            <Box display="flex" justifyContent="flex-end" p="1rem">
              <IconButton
                onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
              >
                <Close />
              </IconButton>
            </Box>

            {/* MENU ITEMS */}
            <FlexBetween
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              gap="3rem"
            >
                 
            <Badge badgeContent={connectionCount} color="secondary">
              <Group
                onClick={handleNotification}
                sx={{ fontSize: "25px", color: "white", cursor: "pointer" }}
              />
            </Badge>

            <Message
              onClick={() => navigate("/chat")}
              sx={{ fontSize: "25px", color: "white", cursor: "pointer" }}
            />

            <Work
              onClick={() => navigate("/jobLists")}
              sx={{ fontSize: "25px", color: "white", cursor: "pointer" }}
            />

            <Badge badgeContent={jobCount} color="secondary">
              <Notifications
                sx={{ fontSize: "25px", color: "white", cursor: "pointer" }}
                onClick={(e) => {
                  handleNotificationClick(e);
                  handleJobNotification(e);
                }}
              />
            </Badge>

            <FormControl variant="standard" value={fullName}>
              <Select
                value={fullName}
                sx={{
                  backgroundColor: neutralLight,
                  width: "150px",
                  borderRadius: "0.25rem",
                  p: "0.25rem 1rem",
                  "& .MuiSvgIcon-root": {
                    pr: "0.25rem",
                    width: "3rem",
                  },
                  "& .MuiSelect-select:focus": {
                    backgroundColor: neutralLight,
                  },
                }}
                input={<InputBase />}
              >
                <MenuItem value={fullName}>
                  <Typography>{fullName}</Typography>
                </MenuItem>
                <MenuItem onClick={() => dispatch(setLogout())}>
                  Log Out
                </MenuItem>
              </Select>
            </FormControl>
          </FlexBetween>
          
          </Box>
        )}
      </FlexBetween>
      {/* Notification Popover */}
      <Popover
        open={isNotificationPopoverOpen}
        anchorEl={notificationAnchorEl}
        onClose={handleNotificationClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        {jobData.map((job) => (
          <List>
            {/* Render your list of notifications here */}

            <ListItem>
              <ListItemText style={{cursor:"pointer"}} onClick={()=>handleReadNotification(job._id,job.jobId)} primary={job.notification_title} />
            </ListItem>
            <ListItem>
              <ListItemText  primary={TimeAgo({ timestamp: job.createdAt })} />
            </ListItem>
            {/* Add more notification items as needed */}
          </List>
        ))}
      </Popover>
    </AppBar>
  );
};

export default Navbar;
