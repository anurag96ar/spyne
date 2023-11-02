import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setLogin } from "../../state/state";
import { useNavigate } from "react-router-dom";
import Headers from "../../components/Headers"; // Import your Navbar component
import { ToastContainer, toast } from "react-toastify";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simulate a login request, replace with actual API call
    // ...

    // Assuming you receive a response containing user and token data
    const response = await fetch("http://localhost:3001/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (response.status === 200) {
      const data = await response.json();
      dispatch(
        setLogin({
          user: data.user,
          token: data.token,
        })
      );
      navigate("/feeds");
    } else {
      // Handle login error here
      toast.error("Please Contact Administrator");
    }
  };

  const handleGoogleLogin = async (credentialResponseDecoded) => {
    console.log("inside handle google login");
    console.log(credentialResponseDecoded.email);
    let email = { email: credentialResponseDecoded.email };
    const response = await axios.post(
      "http://localhost:3001/auth/gooleLogin",

      email
    );
    console.log(response, "--------response-----------");
    const data = await response.data;
    if (response.data.message === "Google Login") {
      dispatch(
        setLogin({
          user: data.user,
          token: data.token,
        })
      );
      console.log("inside if google login");
      navigate("/feeds");
    } else {
      if (response.data.message === "Invalid User") {
        console.log(response.data.email, "response email");
        navigate(`/googlesignupform/${response.data.email}`);
        toast("User is not Registered, So Please SignUp");
      }
    }
  };

  return (
    <div>
      <Headers />
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-6 d-flex justify-content-center align-items-center">
            <form onSubmit={handleSubmit} className="w-75">
              {/* New text above email field */}
              <div className="mb-4">
                <h3 className="text-muted">
                  Your gateway to the professional world
                </h3>
              </div>

              {/* Email input */}
              <div className="mb-4">
                <label htmlFor="email" className="form-label">
                  Email address
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  value={email}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Password input */}
              <div className="mb-4">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  name="password"
                  value={password}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Submit button */}
              <button type="submit" className="btn btn-info mb-4">
                Sign in
              </button>

              {/* Forgot password */}
              <p className="small mb-5">
                <a className="text-muted" href="#!">
                  Forgot password?
                </a>
              </p>
              <div className="mt-4">
                <GoogleLogin
                  onSuccess={(credentialResponse) => {
                    var credentialResponseDecoded = jwtDecode(
                      credentialResponse.credential
                    );
                    console.log(credentialResponseDecoded);
                    if (credentialResponseDecoded) {
                      handleGoogleLogin(credentialResponseDecoded);
                    }
                  }}
                  onError={() => {
                    console.log("Login Failed");
                  }}
                />
              </div>

              {/* Register link */}
              <p>
                Don't have an account?{" "}
                <a href="/register" className="link-info">
                  Register here
                </a>
              </p>
            </form>
          </div>

          {/* Your existing right-side image column */}
          <div className="col-md-6 p-0">
            <img
              src="/wifi.gif"
              alt="Login image"
              className="w-100"
              style={{
                objectFit: "cover",
                objectPosition: "left",
                height: "680px", // Increase the height here
              }}
            />
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Login;