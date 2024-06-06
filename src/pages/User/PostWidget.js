import {
  AlignHorizontalLeft,
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
} from "@mui/icons-material";
import MoreHorzIcon from "@mui/icons-material/MoreVert";
import {
  Box,
  Divider,
  IconButton,
  Typography,
  useTheme,
  TextField,
  Button,
} from "@mui/material";
import FlexBetween from "../../components/FlexBetween";
import Friend from "../../components/Friend";
import WidgetWrapper from "../../components/WidgetWrapper";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "../../state/state";
import axios from "axios";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { toast, ToastContainer } from "react-toastify";
import moment from "moment";
import InfiniteScroll from "react-infinite-scroll-component";
import { instance } from "../../services/axiosInterceptor";

const PostWidget = ({
  handleCallback,
  postId,
  postUserId,
  postEmail,
  isProfile,
  name,
  isAdmin,
  isBlocked,
  description,
  location,
  picturePath,
  userPicturePath,
  likes,
  comments,
  reportedBy,
  index
}) => {
  const [isComments, setIsComments] = useState(false);
  const [userComment, setName] = useState("");
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const [newDes, setDes] = useState("");
  

  const dispatch = useDispatch();

  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);
  const isLiked = Boolean(likes[loggedInUserId]);
  const likeCount = Object.keys(likes).length;

  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;

  const [posts, setPostData] = useState([]);
  
  const [page, setPage] = useState(1); // Track the page number
  const [loading, setLoading] = useState(false); // Loading state
  const [hasMore, setHasMore] = useState(true);
  const [modal, setModal] = useState(false);

  const email = useSelector((state) => state.user.email);
  const firstName = useSelector((state) => state.user.firstName);

  const [show, setShow] = useState(false);

  const handlelose = () => setShow(false);
  const handleShow = () => setShow(true);


  
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

  

  const showMenu = (e) => {
    e.preventDefault();
    setMenuPosition({ top: e.clientY, left: e.clientX });
    setMenuVisible(true);
  };

  const hideMenu = () => {
    setMenuVisible(false);
  };

  const handleMenuItemClick = (action) => {
    // Handle the action when a menu item is clicked
    console.log("Menu item clicked:", action);
    hideMenu();
  };

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = async () => {
    setAnchorEl(null);
    setModal(true);
  };

  const handleOpen = async (description) => {
    setAnchorEl(null);
    setModal(true);
    setShow(true);
    setDes(description);
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("description", newDes);

    const response = await instance.post(
      `/title/${postId}`,
      formData,
      {
        headers: {  
          "Content-Type": "application/json",
        },
      }
    );

    const updatedPost = response.data;
    dispatch(setPost({ post: updatedPost }));
    setShow(false);
    if (response.status === 200) {
      toast.success("Updated");
    }
    handleCallback(index);
  };

  const blockPost = async ()=>{
    const response = await instance.post(`/blockPost/${postId}`,
    {
    
        "Content-Type": "application/json",
     
    })

    const blockres = response.data;
   

    if (response.status === 200) {
      toast.success("Updated");
    }
    setShow(false)
    setAnchorEl(null);
    handleCallback(index)
  }

  const handleDelete = async () => {
    const response = await instance.delete(
      `/deletePost/${postId}`,
      {
        headers: {
        
          "Content-Type": "application/json",
        },
      }
    );

    const updatedPost = response.data;
    dispatch(setPost({ post: updatedPost }));

    if (response.status === 200) {
      toast.success("Updated");
    }
    handleCallback(index,postId);
  };

  const patchLike = async () => {
    try {
      const response = await instance.patch(
        `/${postId}/like`,
        { userId: loggedInUserId },
        {
          headers: {
            
            "Content-Type": "application/json",
          },
        }
      );
      handleCallback(index);

      const updatedPost = response.data;
      dispatch(setPost({ post: updatedPost }));
    } catch (error) {
      console.error("Error patching like:", error);
      // Handle errors here
    }
    // getPosts();
  };

  const handleReport = async () => {
    try {
      const response = await instance.patch(
        `/${postId}/report`,
        { email: email },

        {
          headers: {
          
            "Content-Type": "application/json",
          },
        }
      );
      setName("");
      handleCallback(index);

      const updatedPost = response.data;
      dispatch(setPost({ post: updatedPost }));
      toast.success("Reported Successfully");
    } catch (error) {
      console.error("Error patching like:", error);
      // Handle errors here
    }
  };

  const patchComment = async () => {
    try {
      const response = await instance.patch(
        `/${postId}/comment`,
        {
          userId: loggedInUserId,
          comment: userComment,
          email: email,
          firstName: firstName,
        },

        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setName("");
      handleCallback(index);

      const updatedPost = response.data;
      dispatch(setPost({ post: updatedPost }));
    } catch (error) {
      console.error("Error patching like:", error);
      // Handle errors here
    }
    // getPosts();
  };

  return (
    <WidgetWrapper sx={{ background:isAdmin && isBlocked?"#FFC8C8":"#F1EFEF"}} m="2rem 0">
      {isAdmin && reportedBy.length>0?
      <Box  sx={{background:"red", color:"white", textAlign:"-webkit-center",fontWeight:"bold" }} >
        <Typography sx={{fontWeight:"bold"}} >User Reported</Typography>
        </Box>
        :<Box></Box>
}

      {modal && (
        <Modal style={{ paddingTop: "100px" }} show={show} onHide={handlelose}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Description</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlTextarea1"
              >
                <TextField
                  width="200px"
                  value={newDes}
                  label="Description"
                  onChange={(e) => {
                    setDes(e.target.value);
                  }}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handlelose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      )}
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          aria-controls="popup-menu"
          aria-haspopup="true"
          onClick={handleClick}
        >
          ...
        </Button>
        <Menu
          id="popup-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handlelose}
        >
            {isProfile ?
          <MenuItem onClick={() => handleOpen(description)}>Edit</MenuItem>:
          <Box></Box>
   }
                   {isProfile ?
          <MenuItem onClick={handleDelete}>Delete</MenuItem>:
          <Box></Box>
        }

        {isAdmin ?
          <MenuItem onClick={blockPost}>{isBlocked?"Unblock":"Block"}</MenuItem>:
          <Box></Box>
        }
                
         {postEmail===email || isAdmin ?<Box></Box>:
          <MenuItem onClick={handleReport}>Report</MenuItem>
            }
                
        </Menu>
      </div>
      <Friend
        email={email}
        friendId={postUserId}
        name={name}
        subtitle={location}
        userPicturePath={userPicturePath}
      />
      <Typography color={main} sx={{ mt: "1rem" }}>
        {description}
      </Typography>
    
      {picturePath && (
        <img
          width="100%"
          height="auto"
          alt="post"
          style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
          src={` http://localhost:3001/assets/${picturePath}`}
        />
      )}
      <FlexBetween mt="0.25rem">
        <FlexBetween gap="1rem">
          <FlexBetween gap="0.3rem">
            <IconButton onClick={patchLike}>
              {isLiked ? (
                <FavoriteOutlined sx={{ color: primary }} />
              ) : (
                <FavoriteBorderOutlined />
              )}
            </IconButton>
            <Typography>{likeCount}</Typography>
          </FlexBetween>

          <FlexBetween gap="0.3rem">
            <IconButton onClick={() => setIsComments(!isComments)}>
              <ChatBubbleOutlineOutlined />
            </IconButton>

            <Typography>{comments.length}</Typography>
          </FlexBetween>
        </FlexBetween>

        <IconButton>
          <ShareOutlined />
        </IconButton>
      </FlexBetween>
      {isComments && (
        <Box mt="0.5rem">
          {comments.map((comment, i) => (
            <Box key={`${comment.name}-${i}`}>
              <Divider />
              <Typography
                sx={{
                  color: main,
                  m: "0.5rem 0",
                  pl: "1rem",
                  fontWeight: "bold",
                }}
              >
                {comment.name}
              </Typography>
              <Typography sx={{ color: main, m: "0.5rem 0", pl: "1rem" }}>
                {comment.comment} {TimeAgo({ timestamp: comment.createdAt })}
              </Typography>
            </Box>
          ))}
          <Divider />
          <TextField
            width="200px"
            value={userComment}
            label="Comment"
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
          <Button onClick={patchComment}>Post</Button>
        </Box>
      )}
    </WidgetWrapper>
  );
};

export default PostWidget;
