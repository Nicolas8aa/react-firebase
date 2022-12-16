import React, { useState, useEffect } from "react";
import { Login, DataSensors } from "./components";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { app, database } from "./firebaseConfig";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/datasensors" element={<DataSensors />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
