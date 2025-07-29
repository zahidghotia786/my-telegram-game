import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import SlotGame from "./games/SlotGame";
import DiceGame from "./games/Dice";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/slot" element={<SlotGame />} />
        <Route path="/dice" element={<DiceGame />} />
      </Routes>
    </Router>
  );
}

export default App;
