import React, { useState } from "react";
import "./Login.css";
import { Typography, Button } from "@mui/material";
import logo from "./logo.svg";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Lock from "@mui/icons-material/Lock";

import { useNavigate } from "react-router-dom";
import { login } from "./loginSlice";

import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { useDispatch } from "react-redux";
import AlertPopup from "../Alerts/AlertPopup";

const Login = () => {
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [userId, setUserId] = useState("");
  const auth = getAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [alert, setAlert] = useState(null);

  const handleSignIn = () => {
    signInWithEmailAndPassword(auth, userEmail, userPassword)
      .then((response) => {
        //console.log(response.user);
        dispatch(login({ uid: response.user.uid }));
        setUserId(response.user.uid);
        navigate("/datasensors");
        //change route
      })
      .catch((error) => {
        setAlert(error.message);
      });
  };
  const handleSignUp = () => {
    createUserWithEmailAndPassword(auth, userEmail, userPassword)
      .then((response) => {
        console.log(response.user);
        //change route
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  return (
    <Box
      sx={{
        bgcolor: "#282c34",
        height: "100vh",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        fontSize: "calc(10px + 2vmin)",
        color: "white",
        padding: "40px 20px 0 20px",
      }}
    >
      <AlertPopup open={!!alert} closeFun={() => setAlert(null)} autoClose>
        {alert}
      </AlertPopup>
      <Typography variant="h3" component="h2" gutterBottom align="center">
        ESP-32 FIREBASE
      </Typography>

      <img src={logo} className="App-logo" alt="logo" />

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "60%",
          maxWidth: "400px",
          bgcolor: "ghostwhite",
          borderRadius: "10px",
          padding: "20px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-end",
            justifyContent: "center",
            width: "100%",
            margin: "10px 0",
          }}
        >
          <AccountCircle sx={{ color: "action.active", mr: 1, my: 0.5 }} />
          <TextField
            id="input-with-icon-textfield"
            label="User Email"
            variant="standard"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            inputProps={{ type: "email" }}
            sx={{ width: "80%" }}
          />
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-end",
            justifyContent: "center",
            width: "100%",
            margin: "10px 0",
          }}
        >
          <Lock sx={{ color: "action.active", mr: 1, my: 0.5 }} />
          <TextField
            label="Password"
            variant="standard"
            value={userPassword}
            onChange={(e) => setUserPassword(e.target.value)}
            inputProps={{ type: "password" }}
            sx={{ width: "80%" }}
          />
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-around",
            width: "100%",
            marginTop: "20px",
          }}
        >
          <Button variant="contained" color="primary" onClick={handleSignIn}>
            Sign In
          </Button>
          <Button variant="contained" onClick={handleSignUp} disabled>
            Sign Up
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
