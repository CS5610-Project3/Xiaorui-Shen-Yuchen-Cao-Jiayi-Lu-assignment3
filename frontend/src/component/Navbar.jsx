import * as React from "react";
import { useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import Button from "@mui/material/Button";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Avatar } from "@mui/material";
import { Link } from "react-router-dom";
import TwitterIcon from "@mui/icons-material/Twitter";
import cookie from "react-cookies";
import { TOKEN_COOKIE_NAME } from "../constant";
import { useNavigate } from "react-router";
import { UserService } from "../service/UserService";

export default function Navbar() {
  const [activeUsername, setActiveUsername] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [profileImage, setProfileImage] = React.useState(null);
  const navigate = useNavigate();

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  useEffect(() => {
    setActiveUsername(cookie.load("username"));
  }, []);

  useEffect(() => {
    UserService.getUserInfo(activeUsername).then((res) => {
      setProfileImage(res.data.userData.profileImage);
    });
  }, [activeUsername]);

  const hasLoggedIn = !!cookie.load(TOKEN_COOKIE_NAME);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  function handleLogout() {
    if (hasLoggedIn) {
      cookie.remove(TOKEN_COOKIE_NAME);
      cookie.remove("username");
      navigate("login");
      window.location.reload();
    }
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            component={Link}
            to="/"
          >
            <TwitterIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Twitter
          </Typography>
          {hasLoggedIn && (
            <div>
              <Button color="inherit" onClick={handleOpenUserMenu}>
                <Avatar
                  src={profileImage}
                  aria-label="recipe"
                  sx={{ marginRight: 1 }}
                ></Avatar>
                <Typography variant="button">{activeUsername}</Typography>
                <KeyboardArrowDownIcon />
              </Button>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem onClick={handleClose} component={Link} to="/">
                  Main Page
                </MenuItem>
                <MenuItem
                  onClick={handleClose}
                  component={Link}
                  to="/user-post"
                >
                  User Page
                </MenuItem>
                <MenuItem onClick={handleLogout}>Log Out</MenuItem>
              </Menu>
            </div>
          )}
          {!hasLoggedIn && (
            <div>
              <Button color="inherit" component={Link} to="login">
                Log In
              </Button>
              <Button color="inherit" component={Link} to="signup">
                Sign Up
              </Button>
            </div>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
