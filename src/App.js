import React, { useState, useEffect } from "react";
import { Login, DataSensors } from "./components";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { app, database } from "./firebaseConfig";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ isAllowed, redirectPath = "/", children }) => {
  if (!isAllowed) {
    return <Navigate to={redirectPath} replace />;
  }

  return children ? children : <Outlet />;
};

function App() {
  const { uid } = useSelector((state) => state.login);
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Login />} />
        <Route element={<ProtectedRoute isAllowed={!!uid} />}>
          <Route path="datasensors" element={<DataSensors />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
