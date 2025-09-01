import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import authService from '../services/auth_service';
import logoDark from "../assets/images/logo-dark.png";
import { COLORS } from "../utils/theme/colors";
import { STYLES } from "../utils/typography/styles";
import { APP_ROUTES } from "../utils/strings/app_routes";
import { LOGIN_STRINGS } from "../utils/strings/pages/login_strings";
import { CONSTANTS } from "../utils/strings/constants";
import { FiEye, FiEyeOff } from "react-icons/fi";

const AdminLogin: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    authService.checkSession().then((sessionExists) => {
      setIsAuthenticated(sessionExists);
    });
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(APP_ROUTES.DASHBOARD);
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const success = await authService.login(username, password);
      if (success) {
        setIsAuthenticated(true);
      } else {
        setError(CONSTANTS.MESSAGES.INVALID_INPUT);
      }
    } catch (err) {
      setError(CONSTANTS.MESSAGES.LOGIN_FAILED);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="d-flex flex-column align-items-center min-vh-100" style={{ backgroundColor: COLORS.purple }}>
      <div className="card shadow-lg rounded-3 p-2" style={{ width: "450px", marginTop: "4%" }}>
        <div className="card-body p-4">
          <div className="text-center mb-4">
            <a href="/" className="d-block mb-3">
              <img
                src={logoDark}
                alt={LOGIN_STRINGS.IMAGE}
                height="22"
              />
            </a>
            <p className="text-muted mb-0"  style={{ ...STYLES.label, marginRight: "50px", marginLeft: "50px" }}>
              {LOGIN_STRINGS.TEXT}
            </p>
          </div>

          {error && (
            <div className="alert alert-danger alert-dismissible fade show" role="alert">
              {error}
              <button
                type="button"
                className="btn-close"
                onClick={() => setError("")}
              ></button>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate autoComplete="off">
            <div className="mb-3">
              <label htmlFor="username" className="form-label small fw-medium" style={STYLES.field_label}>
                {LOGIN_STRINGS.FORM.FIELDS.USERNAME.LABEL}
              </label>
              <input
                className="form-control"
                type="text"
                id="username"
                placeholder={LOGIN_STRINGS.FORM.FIELDS.USERNAME.HINT}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                style={STYLES.field_text}
              />
              <div className="invalid-feedback">{LOGIN_STRINGS.FORM.FIELDS.USERNAME.ERROR}</div>
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label small fw-medium" style={STYLES.field_label}>
                {LOGIN_STRINGS.FORM.FIELDS.PASSWORD.LABEL}
              </label>
              <div className="input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className="form-control"
                  placeholder={LOGIN_STRINGS.FORM.FIELDS.PASSWORD.HINT}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={STYLES.field_text}
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <i className={`fe ${showPassword ? <FiEyeOff /> : <FiEye />}`}></i>
                </button>
                <div className="invalid-feedback">{LOGIN_STRINGS.FORM.FIELDS.PASSWORD.ERROR}</div>
              </div>
            </div>

            <div className="d-grid">
              <button
                className="btn fw-semibold"
                type="submit"
                disabled={isLoading}
                style={{ backgroundColor: COLORS.purple, color: COLORS.white }}
              >
                 
                {isLoading ? LOGIN_STRINGS.FORM.BUTTONS.LOGINING_IN : LOGIN_STRINGS.FORM.BUTTONS.LOGIN}
              </button>
            </div>
          </form>
        </div>
      </div>

      <footer className="mt-auto text-white-50 small text-center pb-3">
        2024 © Alpha Linkup
      </footer>
    </div>
  );
};

export default AdminLogin;
