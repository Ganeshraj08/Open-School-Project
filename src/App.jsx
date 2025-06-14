import React, { useState } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import About from "./pages/About";
import Admission from "./pages/Admission";
import Services from "./pages/Services";
import AcademicsCom from "./pages/AcademicsCom";
import LoginPage from "./pages/LoginPage";
import EditPage from "./pages/EditPage";
import ImageGallery from "./pages/ImageGallery";
import Contact from "./pages/Contact";
import Video from "./pages/Video/Video";
import Update from "./pages/Update/Update";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <Navbar isLoggedIn={isLoggedIn}
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="admissions" element={<Admission />} />
        <Route path="services" element={<Services />} />
        <Route path="academics" element={<AcademicsCom />} />
        <Route path="contact" element={<Contact />} />
        <Route path="video" element={<Video />} />
        <Route path="update" element={<Update />} />

        <Route path="gallery" element={<ImageGallery  isLoggedIn={isLoggedIn}/>} />
        <Route path="login" element={<LoginPage setIsLoggedIn={setIsLoggedIn} />} />
        <Route
          path="editGallery"
          element={isLoggedIn ? <EditPage /> : <LoginPage setIsLoggedIn={setIsLoggedIn}/>}
        />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
