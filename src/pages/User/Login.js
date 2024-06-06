import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setLogin } from "../../state/state";
import { useNavigate } from "react-router-dom";
import Headers from "../../components/Headers"; // Import your Navbar component
import { ToastContainer, toast } from "react-toastify";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { instance } from "../../services/axiosInterceptor";


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
  
    try {
      const response = await instance.post("/auth/login", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (response.status === 200) {
        const data = response.data;
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
    } catch (error) {
      // Handle request error
      console.error("Request error:", error);
    
      
    }
  };
  
  const handleGoogleLogin = async (credentialResponseDecoded) => {
    console.log("inside handle google login");
    console.log(credentialResponseDecoded.email);
    let email = { email: credentialResponseDecoded.email };
    const response = await instance.post(
      "/auth/gooleLogin",

      email
    );

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
        navigate(`/register/${response.data.email}`);
        toast("User is not Registered, So Please SignUp");
      }
    }
  };

  return (
    <div>
      <Headers />
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-6 d-flex justify-content-center align-items-center mt-5 mt-md-0">
            <form onSubmit={handleSubmit} className="w-75">
              {/* New text above email field */}
              <div className="mt-10 mt-md-4">
                <h3 className="text-muted">
                  Your gateway to the professional world
                </h3>
              </div>

              {/* Email input */}
              <div className="mt-10 mt-md-4">
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
              <div className="mt-10 mt-md-4">
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
              <button type="submit" style={{marginTop: "60px"}} className="btn btn-info mt-10 mt-md-4">
                Sign in
              </button>

              {/* Forgot password */}
              <p className="small mt-10 mt-md-4">
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
              <p className="mt-5">
                Don't have an account?{" "}
                <a href="/register/newuser" className="link-info">
                  Register here
                </a>
              </p>
            </form>
          </div>

          {/* Your existing right-side image column */}
          <div className="col-md-6 d-none d-sm-block p-0">
            <img
              src="/wifi.gif"
              alt="Login image"
              className="w-100 img-fluid"
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
