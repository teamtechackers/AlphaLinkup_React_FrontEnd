import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { COLORS } from "../../utils/theme/colors";
import { STYLES } from "../../utils/typography/styles";
import { APP_ROUTES } from "../../utils/strings/app_routes";

import { FiAirplay, FiBriefcase, FiChevronDown, FiBarChart2, FiHeadphones , FiUsers, FiCreditCard, FiGrid, FiAperture, FiStar, FiFolderPlus, FiChevronRight,  } from "react-icons/fi";

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

  const handleHover = (e: React.MouseEvent<HTMLElement>, active: boolean) => {
    if (!active) e.currentTarget.style.color = COLORS.teal;
  };

  const handleLeave = (e: React.MouseEvent<HTMLElement>, active: boolean) => {
    if (!active) e.currentTarget.style.color = COLORS.darkGray;
  };

  const handleMenuClick = () => {
    setOpenDropdown(null);
    setOpenSubDropdown(null);
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
          <ul className="navbar-nav me-auto mt-2 mb-2 mb-lg-0"
          style={{ gap: "20px" }} >

            {/* Dashboard */}
            <li className="nav-item">
              <Link
                to={APP_ROUTES.DASHBOARD}
                className="nav-link"
                onMouseEnter={(e) => handleHover(e, isActive(APP_ROUTES.DASHBOARD))}
                onMouseLeave={(e) => handleLeave(e, isActive(APP_ROUTES.DASHBOARD))}
                style={{
                  ...STYLES.nav_item,
                  color: isActive(APP_ROUTES.DASHBOARD) ? COLORS.teal : COLORS.darkGray,
                }}
              >
              <FiAirplay size={16} style={{ marginRight: 8, marginBottom: 2 }} />
                Dashboard
              </Link>
            </li>

            <li className="nav-item dropdown">
              <button
                className="nav-link"
                style={STYLES.nav_item}
                onMouseEnter={(e) => handleHover(e, isActive("masters"))}
                onMouseLeave={(e) => handleLeave(e, isActive("masters"))}
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
                    onMouseEnter={(e) => handleHover(e, isActive("general"))}
                    onMouseLeave={(e) => handleLeave(e, isActive("general"))}
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
                    <li><Link className="dropdown-item" onClick={handleMenuClick} to={APP_ROUTES.COUNTRIES} style={STYLES.nav_item}>Country</Link></li>
                    <li><Link className="dropdown-item" onClick={handleMenuClick} to={APP_ROUTES.STATES} style={STYLES.nav_item}>State</Link></li>
                    <li><Link className="dropdown-item" onClick={handleMenuClick} to={APP_ROUTES.CITIES} style={STYLES.nav_item}>City</Link></li>
                    <li><Link className="dropdown-item" onClick={handleMenuClick} to={APP_ROUTES.EMPLOYMENT_TYPES} style={STYLES.nav_item}>Employment Type</Link></li>
                    <li><Link className="dropdown-item" onClick={handleMenuClick} to={APP_ROUTES.INTERESTS} style={STYLES.nav_item}>Interests</Link></li>
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
                    onMouseEnter={(e) => handleHover(e, isActive("jobs"))}
                    onMouseLeave={(e) => handleLeave(e, isActive("jobs"))}
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
                    <li><Link className="dropdown-item" onClick={handleMenuClick} to={APP_ROUTES.JOB_TYPES} style={STYLES.nav_item}>Job Type</Link></li>
                    <li><Link className="dropdown-item" onClick={handleMenuClick} to={APP_ROUTES.PAY} style={STYLES.nav_item}>Pay</Link></li>
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
                    onMouseEnter={(e) => handleHover(e, isActive("events"))}
                    onMouseLeave={(e) => handleLeave(e, isActive("events"))}
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
                    <li><Link className="dropdown-item" onClick={handleMenuClick} to={APP_ROUTES.EVENT_MODES} style={STYLES.nav_item}>Event Mode</Link></li>
                    <li><Link className="dropdown-item" onClick={handleMenuClick} to={APP_ROUTES.EVENT_TYPES} style={STYLES.nav_item}>Event Type</Link></li>
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
                    onMouseEnter={(e) => handleHover(e, isActive("investors"))}
                    onMouseLeave={(e) => handleLeave(e, isActive("investors"))}
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
                    <li><Link className="dropdown-item" onClick={handleMenuClick} to={APP_ROUTES.INDUSTRY_TYPES} style={STYLES.nav_item}>Industry Type</Link></li>
                    <li><Link className="dropdown-item" onClick={handleMenuClick} to={APP_ROUTES.FUND_SIZES} style={STYLES.nav_item}>Fund Size</Link></li>
                  </ul>
                </li>

                {/* Single Link */}
                <li>
                  <Link
                    className="dropdown-item"
                    to={APP_ROUTES.FOLDERS}
                    onClick={handleMenuClick}
                    style={{ 
                      ...STYLES.nav_item, 
                      display: "flex", 
                      justifyContent: "space-between", 
                      alignItems: "center" 
                    }}
                    onMouseEnter={(e) => handleHover(e, isActive("folders"))}
                    onMouseLeave={(e) => handleLeave(e, isActive("folders"))}
                  >
                    <span style={{ display: "flex", alignItems: "center" }}>
                      <FiFolderPlus size={16} style={{ marginRight: 8 }} />
                      Folders
                    </span>
                    <FiChevronRight size={16} />
                  </Link>
                </li>
              </ul>
            </li>


            {/* Users */}
            <li className="nav-item">
              <Link
                to={APP_ROUTES.USERS}
                className={`nav-link ${isActive(APP_ROUTES.USERS) ? "active" : ""}`}
                style={{
                  ...STYLES.nav_item,
                  color: isActive(APP_ROUTES.USERS) ? COLORS.teal : COLORS.darkGray,
                }}
                onMouseEnter={(e) => handleHover(e, isActive(APP_ROUTES.USERS))}
                onMouseLeave={(e) => handleLeave(e, isActive(APP_ROUTES.USERS))}
              >
                <FiUsers  size={16} style={{ marginRight: 8, marginBottom: 2 }} />
                Users
              </Link>
            </li>

            {/* Jobs */}
            <li className="nav-item">
              <Link
                to={APP_ROUTES.JOBS}
                className={`nav-link ${isActive(APP_ROUTES.JOBS) ? "active" : ""}`}
                style={{
                  ...STYLES.nav_item,
                  color: isActive(APP_ROUTES.JOBS) ? COLORS.teal : COLORS.darkGray,
                }}
                onMouseEnter={(e) => handleHover(e, isActive(APP_ROUTES.JOBS))}
                onMouseLeave={(e) => handleLeave(e, isActive(APP_ROUTES.JOBS))}
              >
                <FiBriefcase  size={16} style={{ marginRight: 8, marginBottom: 2 }} />
                Jobs
              </Link>
            </li>

            {/* Events */}
            <li className="nav-item">
              <Link
                to={APP_ROUTES.EVENTS}
                className={`nav-link ${isActive(APP_ROUTES.EVENTS) ? "active" : ""}`}
                style={{
                  ...STYLES.nav_item,
                  color: isActive(APP_ROUTES.EVENTS) ? COLORS.teal : COLORS.darkGray,
                }}
                onMouseEnter={(e) => handleHover(e, isActive(APP_ROUTES.EVENTS))}
                onMouseLeave={(e) => handleLeave(e, isActive(APP_ROUTES.EVENTS))}
              >
                <FiAperture  size={16} style={{ marginRight: 8, marginBottom: 2 }} />
                Events
              </Link>
            </li>

            {/* Card Activation Requests */}
            <li className="nav-item">
              <Link
                to={APP_ROUTES.CARD_ACTIVATION_REQUESTS}
                className={`nav-link ${isActive(APP_ROUTES.CARD_ACTIVATION_REQUESTS) ? "active" : ""}`}
                style={{
                  ...STYLES.nav_item,
                  color: isActive(APP_ROUTES.CARD_ACTIVATION_REQUESTS) ? COLORS.teal : COLORS.darkGray,
                }}
                onMouseEnter={(e) => handleHover(e, isActive(APP_ROUTES.CARD_ACTIVATION_REQUESTS))}
                onMouseLeave={(e) => handleLeave(e, isActive(APP_ROUTES.CARD_ACTIVATION_REQUESTS))}
              >
                <FiCreditCard  size={16} style={{ marginRight: 8, marginBottom: 2 }} />
                Card Activation Requests
              </Link>
            </li>

            {/* Service Providers */}
            <li className="nav-item">
              <Link
                to={APP_ROUTES.SERVICE_PROVIDERS}
                className={`nav-link ${isActive(APP_ROUTES.SERVICE_PROVIDERS) ? "active" : ""}`}
                style={{
                  ...STYLES.nav_item,
                  color: isActive(APP_ROUTES.SERVICE_PROVIDERS) ? COLORS.teal : COLORS.darkGray,
                }}
                onMouseEnter={(e) => handleHover(e, isActive(APP_ROUTES.SERVICE_PROVIDERS))}
                onMouseLeave={(e) => handleLeave(e, isActive(APP_ROUTES.SERVICE_PROVIDERS))}
              >
                <FiStar  size={16} style={{ marginRight: 8, marginBottom: 2 }} />
                Service Providers
              </Link>
            </li>

            {/* Investors */}
            <li className="nav-item">
              <Link
                to={APP_ROUTES.INVESTORS}
                className={`nav-link ${isActive(APP_ROUTES.INVESTORS) ? "active" : ""}`}
                style={{
                  ...STYLES.nav_item,
                  color: isActive(APP_ROUTES.INVESTORS) ? COLORS.teal : COLORS.darkGray,
                }}
                onMouseEnter={(e) => handleHover(e, isActive(APP_ROUTES.INVESTORS))}
                onMouseLeave={(e) => handleLeave(e, isActive(APP_ROUTES.INVESTORS))}
              >
                <FiBarChart2  size={16} style={{ marginRight: 8, marginBottom: 2 }} />
                Investors
              </Link>
            </li>

            {/* Meetings Schedules */}
            <li className="nav-item">
              <Link
                to={APP_ROUTES.MEETINGS_SCHEDULES}
                className={`nav-link ${isActive(APP_ROUTES.MEETINGS_SCHEDULES) ? "active" : ""}`}
                style={{
                  ...STYLES.nav_item,
                  color: isActive(APP_ROUTES.MEETINGS_SCHEDULES) ? COLORS.teal : COLORS.darkGray,
                }}
                onMouseEnter={(e) => handleHover(e, isActive(APP_ROUTES.MEETINGS_SCHEDULES))}
                onMouseLeave={(e) => handleLeave(e, isActive(APP_ROUTES.MEETINGS_SCHEDULES))}
              >
                <FiHeadphones size={16} style={{ marginRight: 8, marginBottom: 2 }} />
                Meeting Schedules
              </Link>
            </li>

          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
