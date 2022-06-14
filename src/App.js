import React, { useState, useEffect, useMemo } from "react";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import { getToken } from "./utils/token";
import AuthContext from "./context/AuthContext";

function App() {
  const [auth, setAuth] = useState(undefined);
  useEffect(() => {
    const token = getToken();
    if (!token) {
      setAuth(null);
    } else {
      setAuth(token);
    }
  }, []);

  const logout = () => {
    console.log("cerrar sesion");
  };
  const setUser = (user) => {
    setAuth(user);
  };
  const authData = useMemo(
    () => ({
      auth,
      logout,
      setUser,
    }),
    [auth]
  );

  return (
    <AuthContext.Provider value={authData}>
      {!auth ? <Login /> : <Dashboard />}
    </AuthContext.Provider>
  );
}

export default App;
