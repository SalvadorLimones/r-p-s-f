import { React, useState, useContext, createContext, useEffect } from "react";
import jwt from "jwt-decode";
import { todoApi } from "../api/todoApi";
import config from "../app.config";

const AuthContext = createContext();
let keepMeLoggedin;

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [taken, setTaken] = useState(null);
  const { post } = todoApi();

  const auth = () => {
    const googleBaseUrl = config.google_base_url;
    const searchParams = new URLSearchParams();
    searchParams.append("client_id", config.google_client_id);
    searchParams.append("scope", "openid");
    searchParams.append("redirect_uri", window.location.origin + "/callback");
    searchParams.append("response_type", "code");
    searchParams.append("prompt", "select_account");

    const fullUrl = googleBaseUrl + "?" + searchParams.toString();

    //window.open(fullUrl, "_self");
    window.location.href = fullUrl;
  };

  const loggedin = async () => {
    console.log("logggedin!");
    const resp = await post("/user/loggedin");
    if (resp.status !== 200) {
      clearInterval(keepMeLoggedin);
      localStorage.removeItem("token");
      setToken(null);
    }
    console.log(resp.data);
  };

  const login = async (code, provider) => {
    try {
      const resp = await post("/user/login", {
        code: code,
        provider: provider,
      });
      setToken(resp.data.sessionToken);
      localStorage.setItem("token", resp.data.sessionToken);
      setUser(jwt(resp.data.sessionToken));
      console.log("USER,", jwt(resp.data.sessionToken));
    } catch (err) {
      clearInterval(keepMeLoggedin);
      localStorage.removeItem("token");
      setToken(null);
    }
  };
  const logout = () => {
    clearInterval(keepMeLoggedin);
    localStorage.removeItem("token");
    setToken(null);
  };

  const register = async (username) => {
    const resp = await post("/user/create", { username });

    if (resp?.status === 200) {
      setToken(resp.data.sessionToken);
      localStorage.setItem("token", resp.data.sessionToken);
      setUser(jwt(resp.data.sessionToken));
    }
    if (resp?.status === 401) {
      setTaken(resp.data);
      console.log(taken);
    }
  };

  const contextValue = {
    user,
    token,
    auth,
    login,
    logout,
    register,
    taken,
    setTaken,
  };

  useEffect(() => {
    const tokenInStorage = localStorage.getItem("token");
    if (tokenInStorage) {
      setToken(tokenInStorage);
      setUser(jwt(tokenInStorage));
      if (user?.userId) {
        loggedin();
        keepMeLoggedin = setInterval(loggedin, 10000);
      }
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (user?.userId) {
      loggedin();
      keepMeLoggedin = setInterval(loggedin, 10000);
    }
    // eslint-disable-next-line
  }, [user]);

  useEffect(() => {
    // eslint-disable-next-line
  }, [taken]);

  return (
    <div>
      <AuthContext.Provider value={contextValue}>
        {children}
      </AuthContext.Provider>
    </div>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("add authprovider route");
  return context;
};

export { AuthProvider, useAuth };
