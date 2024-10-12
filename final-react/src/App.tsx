import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Weather from "./components/Weather/Weather";
import Forecast from "./components/Forecast/Forecast";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Weather />} />
        <Route path="/forecast" element={<Forecast />} />
      </Routes>
    </Router>
  );
};

export default App;
