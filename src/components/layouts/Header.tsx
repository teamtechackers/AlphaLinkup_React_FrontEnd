import React, { useState, useEffect } from "react";
import { COLORS } from "../../utils/theme/colors";
import { STYLES } from "../../utils/typography/styles";
import { UserModel } from "../../models/user_model";
import { CONSTANTS } from "../../utils/strings/constants";
import logoLight from "./../../assets/images/logo-light.png";

import { FiChevronDown,  } from "react-icons/fi";

interface HeaderProps {
  user: UserModel;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <nav
      className="navbar navbar-expand shadow-sm page-padding-1"
      style={{ height: isMobile ? "60px" : "70px", backgroundColor: COLORS.grayDark }}
    >
      <div className="container-fluid d-flex justify-content-between align-items-center">
        {/* LEFT SECTION */}
        <div className="d-flex align-items-center">
          {isMobile && (
            <button
              className="btn btn-link text-white me-3 p-0"
              aria-label="Toggle menu"
            >
              <i className="fe-menu"></i>
            </button>
          )}

          {/* Logo */}
          <a href="/admin-dashboard" className="navbar-brand p-0">
            {isMobile ? (
              <img
                src={logoLight}
                alt="logo"
                style={{ maxHeight: "12px" }}
              />
            ) : (
              <img
                src={logoLight}
                alt="logo"
                style={{ maxHeight: "20px" }}
              />
            )}
          </a>
        </div>

        {/* RIGHT SECTION */}
        <ul className="navbar-nav ms-auto">
          <li className="nav-item dropdown">
            <a
              href="#"
              className="nav-link d-flex align-items-center px-3"
              role="button"
              onClick={toggleDropdown}
              aria-expanded={isDropdownOpen}
              style={STYLES.label_3}
            >
              {user.user_name}
              <FiChevronDown size={16} style={{ marginLeft: 4 }} />
              <i className="mdi mdi-chevron-down ms-1"></i>
            </a>

            <ul
              className={`dropdown-menu dropdown-menu-end shadow-sm ${
                isDropdownOpen ? "show" : ""
              }`}
            >
              <li className="dropdown-header text-muted">
                <h6
                  className="m-0"
                  style={STYLES.label_3}
                >
                  {CONSTANTS.VARIABLES.HEADER.WELCOME}
                </h6>
              </li>

              {/* Divider */}
              <li><hr className="dropdown-divider" /></li>
              
              <li>
                <a
                  href="#"
                  className="dropdown-item d-flex align-items-center"
                  onClick={onLogout}
                >
                  <i className="fe-log-out me-2"></i>
                  <span
                    style={STYLES.label_3}
                  >
                    {CONSTANTS.VARIABLES.HEADER.LOGOUT}
                  </span>
                </a>
              </li>
            </ul>
            
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Header;
