import React, { useState, useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import useLocalStorage from "./hooks/useLocalStorage";
import Navigation from "./routes_nav/Navigation";
import Routes from "./routes_nav/Routes";
import LoadingSpinner from "./common/LoadingSpinner";
import MealPlanApi from "./api/api";
import UserContext from "./auth/UserContext";
import jwt from "jsonwebtoken";
import "./App.css";

export const TOKEN_STORAGE_ID = "meal-plan-token";

const ParentComponent = () => {
  const [infoLoaded, setInfoLoaded] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useLocalStorage(TOKEN_STORAGE_ID);

  useEffect(() => {
    console.debug("App useEffect - token:", token);

    async function loadUserInfo() {
      if (token) {
        try {
          let decodedToken = jwt.decode(token);
          console.debug("Decoded token:", decodedToken);

          if (!decodedToken) {
            console.error("Invalid token:", token);
            setCurrentUser(null);
            setInfoLoaded(true);
            return;
          }

          let { username } = decodedToken;
          console.debug("Decoded username from token:", username);
          MealPlanApi.token = token;
          let currentUser = await MealPlanApi.getCurrentUser(username);
          setCurrentUser(currentUser);
        } catch (err) {
          console.error("Problem loading user info:", err);
          setCurrentUser(null);
        }
      }
      setInfoLoaded(true);
    }

    setInfoLoaded(false);
    loadUserInfo();
  }, [token]);

  function logout() {
    console.debug("Logging out");
    setCurrentUser(null);
    setToken(null);
  }

  async function signup(signupData) {
    try {
      let token = await MealPlanApi.signup(signupData);
      console.debug("Signup successful - received token:", token);
      setToken(token);
      return { success: true };
    } catch (errors) {
      console.error("Signup failed:", errors);
      return { success: false, errors };
    }
  }

  async function login(loginData) {
    try {
      let token = await MealPlanApi.login(loginData);
      console.debug("Login successful - received token:", token);
      setToken(token);
      console.log(
        "Token set in localStorage:",
        localStorage.getItem(TOKEN_STORAGE_ID)
      );
      return { success: true };
    } catch (errors) {
      console.error("Login failed:", errors);
      return { success: false, errors };
    }
  }

  if (!infoLoaded) return <LoadingSpinner />;

  return (
    <BrowserRouter>
      <UserContext.Provider value={{ currentUser, setCurrentUser }}>
        <div className="App">
          <Navigation logout={logout} />
          <Routes login={login} signup={signup} />
        </div>
      </UserContext.Provider>
    </BrowserRouter>
  );
};

export default ParentComponent;
