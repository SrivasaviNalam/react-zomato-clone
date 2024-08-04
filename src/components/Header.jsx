import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEnvelope,
  faPhone,
  faLock,
  faAddressBook,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Header = ({ page }) => {
  const initialSignUpData = {
    fullname: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    address: "",
  };
  let [newUser, setNewUser] = useState({ ...initialSignUpData });
  let [showPassword, setShowPassword] = useState(false);
  let userInfo = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const setInputData = (event) => {
    let { name, value } = event.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const saveUser = async () => {
    let sendData = {
      f_name: newUser.fullname,
      email: newUser.email,
      mobile: newUser.mobile,
      password: newUser.password,
      address: newUser.address,
    };
    let url = "http://localhost:3040/api/send-user-data";
    let { data } = await axios.post(url, sendData);
    if (data.call) {
      alert(data.message);
      window.location.reload();
    } else {
      alert(data.message);
    }
  };

  const userLogin = async () => {
    let sendData = {
      username: newUser.mobile,
      password: newUser.password,
    };
    let url = "http://localhost:3040/api/login";
    let { data } = await axios.post(url, sendData);
    if (data.call) {
      alert("Login successfully!");
      localStorage.setItem("user", JSON.stringify(data.user));
      window.location.reload();
    } else {
      alert("Either username or password is wrong.");
    }
  };

  const userLogout = () => {
    localStorage.removeItem("user");
    window.location.reload();
  };

  return (
    <>
      <section className="row header w-100">
        <section
          className={
            page === "home"
              ? "col-12 bg-transparent px-0 px-lg-3"
              : "col-12 bg-danger px-0 px-lg-3"
          }
        >
          <header className="container d-flex justify-content-between py-3">
            {page === 'home' ? null : (<p className="m-0 brand bg-white fw-bold fs-3 text-danger" onClick={() => navigate("/")}>e!</p>)}
            {userInfo ? (
              <div className="d-flex align-items-center justify-content-end w-100">
                <p className="text-white m-0 px-3">
                  welcome{" "}
                  <span className="text-capitalize">{userInfo.f_name}</span>
                </p>
                <button className="btn btn-warning" onClick={userLogout}>
                  Logout
                </button>
              </div>
            ) : (
              <div className="d-flex align-items-center justify-content-end w-100">
                <a
                  className="btn text-white login-btn"
                  data-bs-toggle="modal"
                  href="#loginModal"
                  role="button"
                >
                  Login
                </a>
                <a
                  className="btn btn-outline-light signup-btn"
                  data-bs-toggle="modal"
                  href="#signUpModal"
                  role="button"
                >
                  Create an account
                </a>
              </div>
            )}
          </header>
        </section>
      </section>
      <div
        className="modal fade signup-modal"
        id="signUpModal"
        aria-hidden="true"
        aria-labelledby="signUpModalLabel"
        tabIndex="-1"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="signUpModalLabel">
                Create Account
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="input-group mb-3">
                  <span className="input-group-text">
                    <FontAwesomeIcon icon={faUser} />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Full Name"
                    value={newUser.fullname}
                    onChange={setInputData}
                    name="fullname"
                  />
                </div>
                <div className="input-group mb-3">
                  <span className="input-group-text">
                    <FontAwesomeIcon icon={faEnvelope} />
                  </span>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Email"
                    value={newUser.email}
                    name="email"
                    onChange={setInputData}
                  />
                </div>
                <div className="input-group mb-3">
                  <span className="input-group-text">
                    <FontAwesomeIcon icon={faPhone} />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Mobile Number"
                    value={newUser.mobile}
                    name="mobile"
                    onChange={setInputData}
                  />
                </div>
                <div className="input-group mb-3">
                  <span className="input-group-text">
                    <FontAwesomeIcon icon={faLock} />
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control"
                    placeholder="Password"
                    value={newUser.password}
                    name="password"
                    onChange={setInputData}
                  />
                  <button
                    type="button"
                    className="bg-primary"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <FontAwesomeIcon
                      className="text-white"
                      icon={showPassword ? faEyeSlash : faEye}
                    />
                  </button>
                </div>
                <div className="input-group mb-3">
                  <span className="input-group-text">
                    <FontAwesomeIcon icon={faLock} />
                  </span>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Confirm Password"
                    value={newUser.confirmPassword}
                    name="confirmPassword"
                    onChange={setInputData}
                  />
                </div>
                <div className="input-group mb-3">
                  <span className="input-group-text">
                    <FontAwesomeIcon icon={faAddressBook} />
                  </span>
                  <textarea
                    className="form-control"
                    placeholder="Address"
                    rows={3}
                    value={newUser.address}
                    name="address"
                    onChange={setInputData}
                  ></textarea>
                </div>
              </form>
            </div>
            <div className="modal-footer d-flex justify-content-between">
              <p>
                Already had an account?{" "}
                <button
                  className="btn btn-link"
                  data-bs-target="#loginModal"
                  data-bs-toggle="modal"
                  data-bs-dismiss="modal"
                >
                  Login
                </button>
              </p>
              <button className="btn btn-primary" onClick={saveUser}>
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        className="modal fade login-modal"
        id="loginModal"
        aria-hidden="true"
        aria-labelledby="loginModalLabel"
        tabIndex="-1"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="loginModalLabel">
                Login
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="input-group mb-3">
                  <span className="input-group-text">
                    <FontAwesomeIcon icon={faPhone} />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Mobile Number"
                    value={newUser.mobile}
                    name="mobile"
                    onChange={setInputData}
                  />
                </div>
                <div className="input-group mb-3">
                  <span className="input-group-text">
                    <FontAwesomeIcon icon={faLock} />
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control"
                    placeholder="Password"
                    value={newUser.password}
                    name="password"
                    onChange={setInputData}
                  />
                  <button
                    type="button"
                    className="bg-primary"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <FontAwesomeIcon
                      className="text-white"
                      icon={showPassword ? faEyeSlash : faEye}
                    />
                  </button>
                </div>
              </form>
            </div>
            <div className="modal-footer d-flex justify-content-between">
              <p>
                Don't have account?{" "}
                <button
                  className="btn btn-link"
                  data-bs-target="#signUpModal"
                  data-bs-toggle="modal"
                  data-bs-dismiss="modal"
                >
                  Create Account
                </button>
              </p>
              <button className="btn btn-primary" onClick={userLogin}>
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
