import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { COLORS } from "../../utils/theme/colors";
import { STYLES } from "../../utils/typography/styles";

import { FiAirplay, FiBriefcase, FiChevronDown, FiBarChart2 , FiUsers, FiCreditCard, FiGrid, FiAperture, FiStar, FiFolderPlus, FiChevronRight,  } from "react-icons/fi";

const Sidebar: React.FC = () => {
  const location = useLocation();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [openSubDropdown, setOpenSubDropdown] = useState<string | null>(null);

  const toggleDropdown = (menu: string) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
    setOpenSubDropdown(null);
  };

  const toggleSubDropdown = (submenu: string) => {
    setOpenSubDropdown(openSubDropdown === submenu ? null : submenu);
  };

  const isActive = (path: string) => location.pathname.startsWith(path);

  const handleHover = (e: React.MouseEvent<HTMLElement>) => {
    e.currentTarget.style.color = COLORS.teal;
  };

  const handleLeave = (e: React.MouseEvent<HTMLElement>) => {
    e.currentTarget.style.color = COLORS.darkGray;
  };

  return (
    <nav className="navbar navbar-expand-lg page-padding-1" style={{ backgroundColor: COLORS.white }}>
      <div className="container-fluid">

        {/* Toggler */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar links */}
        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0"
          style={{ gap: "20px" }} >

            {/* Dashboard */}
            <li className="nav-item">
              <Link
                to="/admin-dashboard"
                className="nav-link"
                onMouseEnter={handleHover}
                onMouseLeave={handleLeave}
                style={STYLES.nav_item}
              >
              <FiAirplay size={16} style={{ marginRight: 8, marginBottom: 2 }} />
                Dashboard
              </Link>
            </li>

            <li className="nav-item dropdown">
              <button
                className="nav-link"
                style={STYLES.nav_item}
                onMouseEnter={handleHover}
                onMouseLeave={handleLeave}
                onClick={() => toggleDropdown("masters")}
                aria-expanded={openDropdown === "masters"}
              >
                <FiGrid  size={16} style={{ marginRight: 8, marginBottom: 2 }} />
                Masters
                <FiChevronDown size={16} style={{ marginLeft: 4 }} />
              </button>

              <ul className={`dropdown-menu ${openDropdown === "masters" ? "show" : ""}`}>
                {/* General Submenu */}
                <li className="dropdown-submenu position-relative">

                  <button
                    className="dropdown-item"
                    style={{
                      ...STYLES.nav_item,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                    onMouseEnter={handleHover}
                    onMouseLeave={handleLeave}
                    onClick={() => toggleSubDropdown("general")}
                  >
                    <span style={{ display: "flex", alignItems: "center" }}>
                      <FiUsers size={16} style={{ marginRight: 8, marginBottom: 2 }} />
                      General
                    </span>
                    <FiChevronRight size={16} />
                  </button>

                  <ul
                    className={`dropdown-menu position-absolute top-0 start-100 ${openSubDropdown === "general" ? "show" : ""}`}
                    style={{ minWidth: "200px" }}
                  >
                    <li><Link className="dropdown-item" to="/list-country" style={STYLES.nav_item}>Country</Link></li>
                    <li><Link className="dropdown-item" to="/list-state" style={STYLES.nav_item}>State</Link></li>
                    <li><Link className="dropdown-item" to="/list-city" style={STYLES.nav_item}>City</Link></li>
                    <li><Link className="dropdown-item" to="/list-employment-type" style={STYLES.nav_item}>Employment Type</Link></li>
                    <li><Link className="dropdown-item" to="/list-interests" style={STYLES.nav_item}>Interests</Link></li>
                  </ul>
                </li>

                {/* Jobs Submenu */}
                <li className="dropdown-submenu position-relative">

                  <button
                    className="dropdown-item"
                    style={{
                      ...STYLES.nav_item,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                    onMouseEnter={handleHover}
                    onMouseLeave={handleLeave}
                    onClick={() => toggleSubDropdown("jobs")}
                  >
                    <span style={{ display: "flex", alignItems: "center" }}>
                      <FiBriefcase size={16} style={{ marginRight: 8, marginBottom: 2 }} />
                      Jobs
                    </span>
                    <FiChevronRight size={16} />
                  </button>

                  <ul
                    className={`dropdown-menu position-absolute top-0 start-100 ${openSubDropdown === "jobs" ? "show" : ""}`}
                    style={{ minWidth: "200px" }}
                  >
                    <li><Link className="dropdown-item" to="/list-job-type" style={STYLES.nav_item}>Job Type</Link></li>
                    <li><Link className="dropdown-item" to="/list-pay" style={STYLES.nav_item}>Pay</Link></li>
                  </ul>
                </li>

                {/* Events Submenu */}
                <li className="dropdown-submenu position-relative">

                  <button
                    className="dropdown-item"
                    style={{
                      ...STYLES.nav_item,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                    onMouseEnter={handleHover}
                    onMouseLeave={handleLeave}
                    onClick={() => toggleSubDropdown("events")}
                  >
                    <span style={{ display: "flex", alignItems: "center" }}>
                      <FiAperture size={16} style={{ marginRight: 8, marginBottom: 2 }} />
                      Events
                    </span>
                    <FiChevronRight size={16} />
                  </button>

                  <ul
                    className={`dropdown-menu position-absolute top-0 start-100 ${openSubDropdown === "events" ? "show" : ""}`}
                    style={{ minWidth: "200px" }}
                  >
                    <li><Link className="dropdown-item" to="/list-event-mode" style={STYLES.nav_item}>Event Mode</Link></li>
                    <li><Link className="dropdown-item" to="/list-event-type" style={STYLES.nav_item}>Event Type</Link></li>
                  </ul>
                </li>

                {/* Investors Submenu */}
                <li className="dropdown-submenu position-relative">
                  <button
                    className="dropdown-item"
                    style={{
                      ...STYLES.nav_item,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                    onMouseEnter={handleHover}
                    onMouseLeave={handleLeave}
                    onClick={() => toggleSubDropdown("investors")}
                  >
                    <span style={{ display: "flex", alignItems: "center" }}>
                      <FiBarChart2 size={16} style={{ marginRight: 8, marginBottom: 2 }} />
                      Investors
                    </span>
                    <FiChevronRight size={16} />
                  </button>
                  <ul
                    className={`dropdown-menu position-absolute top-0 start-100 ${openSubDropdown === "investors" ? "show" : ""}`}
                    style={{ minWidth: "200px" }}
                  >
                    <li><Link className="dropdown-item" to="/list-industry-type" style={STYLES.nav_item}>Industry Type</Link></li>
                    <li><Link className="dropdown-item" to="/list-fund-size" style={STYLES.nav_item}>Fund Size</Link></li>
                  </ul>
                </li>

                {/* Single Link */}
                <li>
                  <button
                    className="dropdown-item"
                    style={{
                      ...STYLES.nav_item,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                    onMouseEnter={handleHover}
                    onMouseLeave={handleLeave}
                    onClick={() => toggleSubDropdown("investors")}
                  >
                    <span style={{ display: "flex", alignItems: "center" }}>
                      <FiFolderPlus size={16} style={{ marginRight: 8, marginBottom: 2 }} />
                      Folders
                    </span>
                    <FiChevronRight size={16} />
                  </button>
                </li>
              </ul>
            </li>


            {/* Users */}
            <li className="nav-item">
              <Link
                to="/list-users"
                className={`nav-link ${isActive("/list-users") ? "active" : ""}`}
                style={STYLES.nav_item}
                onMouseEnter={handleHover}
                onMouseLeave={handleLeave}
              >
                <FiUsers  size={16} style={{ marginRight: 8, marginBottom: 2 }} />
                Users
              </Link>
            </li>

            {/* Jobs */}
            <li className="nav-item">
              <Link
                to="/list-jobs"
                className={`nav-link ${isActive("/list-jobs") ? "active" : ""}`}
                style={STYLES.nav_item}
                onMouseEnter={handleHover}
                onMouseLeave={handleLeave}
              >
                <FiBriefcase  size={16} style={{ marginRight: 8, marginBottom: 2 }} />
                Jobs
              </Link>
            </li>

            {/* Events */}
            <li className="nav-item">
              <Link
                to="/list-events"
                className={`nav-link ${isActive("/list-events") ? "active" : ""}`}
                style={STYLES.nav_item}
                onMouseEnter={handleHover}
                onMouseLeave={handleLeave}
              >
                <FiAperture  size={16} style={{ marginRight: 8, marginBottom: 2 }} />
                Events
              </Link>
            </li>

            {/* Card Activation Requests */}
            <li className="nav-item">
              <Link
                to="/list-card-activation-requests"
                className={`nav-link ${isActive("/list-card-activation-requests") ? "active" : ""}`}
                style={STYLES.nav_item}
                onMouseEnter={handleHover}
                onMouseLeave={handleLeave}
              >
                <FiCreditCard  size={16} style={{ marginRight: 8, marginBottom: 2 }} />
                Card Activation Requests
              </Link>
            </li>

            {/* Service Providers */}
            <li className="nav-item">
              <Link
                to="/list-service-provider"
                className={`nav-link ${isActive("/list-service-provider") ? "active" : ""}`}
                style={STYLES.nav_item}
                onMouseEnter={handleHover}
                onMouseLeave={handleLeave}
              >
                <FiStar  size={16} style={{ marginRight: 8, marginBottom: 2 }} />
                Service Providers
              </Link>
            </li>

            {/* Investors */}
            <li className="nav-item">
              <Link
                to="/list-investors"
                className={`nav-link ${isActive("/list-investors") ? "active" : ""}`}
                style={STYLES.nav_item}
                onMouseEnter={handleHover}
                onMouseLeave={handleLeave}
              >
                <FiBarChart2  size={16} style={{ marginRight: 8, marginBottom: 2 }} />
                Investors
              </Link>
            </li>

          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
