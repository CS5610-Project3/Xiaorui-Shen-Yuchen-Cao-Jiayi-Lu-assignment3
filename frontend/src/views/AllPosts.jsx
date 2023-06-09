import * as React from "react";
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { Stack } from "@mui/material";
import Grid from "@mui/material/Grid";
import Post from "../component/Post";
import { PostService } from "../service/PostService";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import UserList from "./UserList.jsx";
import { UserService } from "../service/UserService.js";

export default function UserPost() {
  const [posts, setPosts] = useState([]);
  const [displayedPosts, setDisplayedPosts] = useState(5);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [getUserClicked, setGetUserClicked] = useState(false);
  const [users, setUsers] = useState(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    PostService.getAllPosts()
      .then((res) => {
        console.log(res);
        setPosts(res.data.posts);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleScroll = () => {
    const scrollTop =
      (document.documentElement && document.documentElement.scrollTop) ||
      document.body.scrollTop;
    const scrollHeight =
      (document.documentElement && document.documentElement.scrollHeight) ||
      document.body.scrollHeight;
    const clientHeight =
      document.documentElement.clientHeight || window.innerHeight;
    const scrolledToBottom =
      Math.ceil(scrollTop + clientHeight) >= scrollHeight;

    if (scrolledToBottom && !loading) {
      setLoading(true);
      setTimeout(() => {
        setDisplayedPosts(displayedPosts + 5);
      }, 500); // add a delay of 1 second
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [loading]);

  useEffect(() => {
    setLoading(false);
  }, [displayedPosts]);

  const handleGetUser = () => {
    if (searchTerm === "") {
      setGetUserClicked(false);
    } else {
      setCount(count + 1);
    }
  };

  const goBack = () => {
    setGetUserClicked(false);
  };

  useEffect(() => {
    UserService.getUserByKeyword(searchTerm)
      .then((res) => {
        console.log(res.data);
        setUsers(res.data);
        setGetUserClicked(true);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [count]);

  const noMorePosts = displayedPosts >= posts.length;

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Container maxWidth="md">
        <Box sx={{ mb: 3 }}>
          <TextField
            id="search"
            label="Search User"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            sx={{ width: "30%", mr: "1rem", ml: "10rem" }}
          />
          <Button
            variant="contained"
            onClick={handleGetUser}
            sx={{ mr: "1rem" }}
          >
            Find Users
          </Button>
          <Button variant="contained" onClick={goBack}>
            Back
          </Button>
        </Box>
        {getUserClicked ? (
          <UserList usercards={users} />
        ) : (
          <Stack spacing={3}>
            <Grid
              container
              spacing={3}
              justifyContent="center"
              alignItems="center"
            >
              {posts.slice(0, displayedPosts).map((post, index) => (
                <Grid
                  item
                  xs={12}
                  md={8}
                  key={post.id}
                  sx={{
                    marginBottom: "1rem",
                    paddingBottom: "1rem",
                    borderBottom:
                      index === posts.length - 1 ? "none" : "1px solid #e0e0e0",
                  }}
                >
                  <Post login={"all"} post={post} />
                </Grid>
              ))}
            </Grid>

            {noMorePosts ? (
              <Box
                sx={{
                  textAlign: "center",
                  fontWeight: "300",
                  color: "grey",
                  fontSize: "small",
                }}
              >
                No more posts to show.
              </Box>
            ) : (
              loading && (
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <CircularProgress />
                </Box>
              )
            )}
          </Stack>
        )}
      </Container>
    </Box>
  );
}
