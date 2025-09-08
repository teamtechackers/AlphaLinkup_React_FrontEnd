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
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminLogin: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [touched, setTouched] = useState({ username: false, password: false });

  const navigate = useNavigate();

  useEffect(() => {
    const sessionExists = authService.checkSession();
    setIsAuthenticated(sessionExists);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(APP_ROUTES.DASHBOARD);
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await authService.login(username, password);
      if (res) {
        setIsAuthenticated(true);
      } else {
        toast.error(CONSTANTS.MESSAGES.INVALID_INPUT);
      }
    } catch (err) {
      toast.error(CONSTANTS.MESSAGES.LOGIN_FAILED);
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

          <form onSubmit={handleSubmit} noValidate autoComplete="off">
            <div className="mb-3">
              <label htmlFor="username" className="form-label small fw-medium" style={STYLES.field_label}>
                {LOGIN_STRINGS.FORM.FIELDS.USERNAME.LABEL}
              </label>
              <input
                className={`form-control ${touched.username && !username ? "is-invalid" : ""}`}
                type="text"
                id="username"
                placeholder={LOGIN_STRINGS.FORM.FIELDS.USERNAME.HINT}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onBlur={() => setTouched({ ...touched, username: true })}
                required
                style={STYLES.field_text}
              />
              {touched.username && !username && (
                <div className="invalid-feedback">
                  {LOGIN_STRINGS.FORM.FIELDS.USERNAME.ERROR}
                </div>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label small fw-medium" style={STYLES.field_label}>
                {LOGIN_STRINGS.FORM.FIELDS.PASSWORD.LABEL}
              </label>
              <div className="input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className={`form-control ${touched.password && !password ? "is-invalid" : ""}`}
                  placeholder={LOGIN_STRINGS.FORM.FIELDS.PASSWORD.HINT}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => setTouched({ ...touched, password: true })}
                  required
                  style={STYLES.field_text}
                />
                <button
                  type="button"
                  className="btn"
                  style={{
                    border: "1px solid #ced4da",
                  }}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
                {touched.password && !password && (
                  <div className="invalid-feedback">
                    {LOGIN_STRINGS.FORM.FIELDS.PASSWORD.ERROR}
                  </div>
                )}
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
