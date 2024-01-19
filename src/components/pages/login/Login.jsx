import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { login } from "../../../redux/auth/authSlice";
import { clearCarts } from "../../../redux/carts/cartsSlice";

function Login() {
  const dispatch = useDispatch();
  const authData = useSelector((state) => state.auth);
  const [passwordType, setPasswordType] = useState("password");
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [errorMsg, setErrorMsg] = useState();
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);

    if (!email || !password) {
      setErrorMsg(`Email and Password is Required`);
      setLoading(false);
      return false;
    }

    if (password && password.length < 6) {
      setErrorMsg(`Password must be more than 5 character`);
      setLoading(false);
      return false;
    }

    if (email && !validateEmail(email)) {
      setErrorMsg(`Invalid Email address`);
      setLoading(false);
      return false;
    }

    dispatch(login({ email, password }));
    dispatch(clearCarts());
    setLoading(false);
  };

  const validateEmail = (email) => {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const passwordShowHide = () => {
    let newType = passwordType === "text" ? "password" : "text";
    setPasswordType(newType);
  };

  return (
    <div className="auth-page-wrapper pt-5">
      <div className="auth-one-bg-position auth-one-bg" id="auth-particles">
        <div className="bg-overlay"></div>

        <div className="shape">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            version="1.1"
            viewBox="0 0 1440 120"
          >
            <path d="M 0,36 C 144,53.6 432,123.2 720,124 C 1008,124.8 1296,56.8 1440,40L1440 140L0 140z"></path>
          </svg>
        </div>
      </div>

      <div className="auth-page-content">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="text-center mt-sm-5 mb-4 text-white-50">
                <div>
                  <a href="index.html" className="d-inline-block auth-logo">
                    {/* <img
                      src="assets/images/greenline-logo.png"
                      alt=""
                      height="80"
                    /> */}
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="row justify-content-center">
            <div className="col-md-8 col-lg-6 col-xl-5">
              <div className="card">
                <div className="card-body p-4">
                  <div className="text-center mt-2">
                    <img
                      src="assets/images/greenline-logo.png"
                      alt=""
                      height="100"
                    />
                  </div>

                  <div className="text-center mt-4">
                    <h5 className="text-primary">Welcome Back !</h5>
                    <p className="text-muted">
                      Sign in to continue to Galaxy Shipping.
                    </p>
                  </div>
                  <div className="p-2 mt-4">
                    <form onSubmit={handleLogin}>
                      <div className="mb-3">
                        <label htmlFor="email" className="form-label">
                          Email
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          onChange={(e) => setEmail(e.target.value)}
                          id="email"
                          placeholder="Enter Email"
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label" htmlFor="password-input">
                          Password
                        </label>
                        <div className="position-relative auth-pass-inputgroup mb-3">
                          <input
                            type={passwordType}
                            className="form-control pe-5"
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter password"
                            id="password-input"
                          />
                          <button
                            className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted"
                            type="button"
                            id="password-addon"
                            onClick={passwordShowHide}
                          >
                            <i className="ri-eye-fill align-middle"></i>
                          </button>
                        </div>
                      </div>
                      {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
                      {authData.error && (
                        <p style={{ color: "red" }}>{authData.errorMessage}</p>
                      )}
                      <div className="mt-4">
                        <button
                          className="btn btn-success w-100"
                          disabled={loading || authData.pending}
                          type="submit"
                        >
                          Sign In
                        </button>
                      </div>
                      <div
                        className="mt-4"
                        style={{
                          display: "flex",
                          flexDirection: "row-reverse",
                        }}
                      >
                        <Link
                          to="/tracking-vehicle-status"
                          className="btn btn-info text-right"
                        >
                          Track Your Car
                        </Link>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="footer start-0">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="text-center"></div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Login;
