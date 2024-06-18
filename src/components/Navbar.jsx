import { Link } from "react-router-dom";
import logo from "../assets/images/photo3.jpeg";
import mobile_menu from "../assets/images/menu-icon.png";
import close_icon from "../assets/images/close-icon.jpeg";
import React, { useState, useRef, useEffect } from "react";
import "../pages/Form.css"; //
import "./Navbar.css";

const Navbar = () => {
  const initialFormData = {
    firstName: "",
    lastName: "",
    age: "",
    gender: "",
    grade: "",
    PhoneNumber: "",
    emailId: "",
    address: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [countdown, setCountdown] = useState(10); // Countdown starts at 5 seconds
  const [exitMsg, setExitMsg] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const formRef = useRef(null);

  const handleChange = (e) => {
    if (success){
      setResult("");
    }
    setExitMsg(false);
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const [result, setResult] = useState("");
  const [success,setSuccess] = useState(true);

  const onSubmit = async (event) => {
    event.preventDefault();
    setSuccess(true);
    setResult(`Sending...`);
    setExitMsg(false);
    
    const formData = new FormData(event.target);

    formData.append("access_key", "43a0a519-a9e8-4647-93a7-eb235bac328f");

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (data.success) {
      setResult("Form Submitted Successfully, thank you!.");
      setFormData(initialFormData);
      setSuccess(true);
      
     
    } else {
      console.log("Error", data);
      setResult(data.message);
      setSuccess(false);
    }
     setExitMsg(true);
     setCountdown(10);

    // Start the countdown
  };

  useEffect(() => {
    if (exitMsg) {
      if (countdown === 0) {
        setShowForm(false);
        setExitMsg(false);
        
      } else {
        const timer = setInterval(() => {
          setCountdown((prevCountdown) => prevCountdown - 1);
        }, 1000);

        return () => clearInterval(timer);
      }
    }
  }, [countdown, exitMsg]);

  const toggleForm = () => {
    setShowForm(!showForm);

    if(success){
      setResult("");
    }
    
  };

  const handleClickOutside = (e) => {
    if (formRef.current && !formRef.current.contains(e.target)) {
      setShowForm(false);
      setExitMsg(false);
    }
  };

  const [mobileMenu, setMobileMenu] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenu(!mobileMenu);
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-logo">
          <Link to="/">
            <img src={logo} className="logo" alt="Logo" />
          </Link>
          {mobileMenu ? (
            <img
              src={close_icon}
              alt="close icon"
              className="menu"
              onClick={toggleMobileMenu}
            />
          ) : (
            <img
              src={mobile_menu}
              alt="menu icon"
              className="menu"
              onClick={toggleMobileMenu}
            />
          )}
        </div>
        <ul id="ani" className={mobileMenu ? "mobile-view" : "navbar-links"}>
          <li>
            <Link to="/">HOME</Link>
          </li>
          <li>
            <Link to="/about">ABOUT US</Link>
          </li>
          <li>
            <Link to="/academics">ACADEMICS</Link>
          </li>
          <li>
            <Link to="/admissions">ADMISSION</Link>
          </li>

          <li>
            <Link to="/services">SERVICES</Link>
          </li>
          <li>
            <Link to="/gallery">GALLERY</Link>
          </li>

          <li>
            <Link to="/contact">CONTACT US</Link>
          </li>
        </ul>
      </nav>
      <div className="message-box">
        <p className="message">
          ADMISSIONS ARE OPEN{" "}
          <span onClick={toggleForm} className="blue-text">
            CLICK HERE
          </span>{" "}
          TO KNOW ABOUT IT
        </p>
      </div>

      {showForm && (
        <div className="form-overlay" onClick={handleClickOutside}>
          <div className="form-container" ref={formRef}>
            <h2>Admission Form</h2>
            <form onSubmit={onSubmit}>
              <div className="form-group">
                <label>First Name:</label>
                <input
                  required
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Last Name:</label>
                <input
                  type="text"
                  required
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Age:</label>
                <input
                  type="text"
                  required
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Gender:</label>
                <input
                  type="text"
                  required
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Grade:</label>
                <input
                  type="text"
                  required
                  name="grade"
                  value={formData.grade}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Phone number:</label>
                <input
                  type="text"
                  required
                  name="PhoneNumber"
                  value={formData.PhoneNumber}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Email Id:</label>
                <input
                  type="text"
                  required
                  name="emailId"
                  value={formData.emailId}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Address:</label>
                <textarea
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>
              <button type="submit">Submit</button>
            </form>
            <span className={!success?"exitMsg":"send"}>{result}</span>
            <span className="exitMsg">
              {exitMsg ? ` Exiting in ${countdown}.` : ""}
            </span>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
