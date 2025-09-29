import React from 'react';
import { Outlet, useNavigate} from 'react-router-dom';
import authService from '../../services/auth_service';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { COLORS } from '../../utils/theme/colors';
import { APP_ROUTES } from '../../utils/strings/app_routes';
import { useEffect, useState } from 'react';

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(authService.getUser());

  useEffect(() => {
    const valid = authService.checkSession();

    if (!valid) {
      navigate(APP_ROUTES.LOGIN);
    } else {
      const u = authService.getUser();
      setUser(u);
    }
  }, [navigate]);

  const handleLogout = () => {
    authService.logout();
    navigate(APP_ROUTES.LOGIN);
  };

return (
  <div
    id="wrapper"
    data-layout-mode="light"
    data-layout='{"mode": "light", "width": "fluid", "menuPosition": "fixed", "topbar": {"color": "dark"}, "showRightSidebarOnPageLoad": true}'
    style={{
      backgroundColor: COLORS.lightGray,
      display: "flex",
      flexDirection: "column",
      minHeight: "100vh",
    }}
  >

  {/* Header */}
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
    }}
  >
    <Header user={user} onLogout={handleLogout} />
  </div>

  {/* Navbar */}
  <div
    style={{
      position: "fixed",
      top: "60px", // height of header
      left: 0,
      right: 0,
      zIndex: 999,
    }}
  >
    <Sidebar /> {/* actually your top navbar */}
  </div>

  {/* Main Content */}
  <div
    className="content-page page-padding-1"
    style={{
      marginTop: "130px",
      flex: 1,
      overflowY: "auto",
      height: "calc(100vh - 120px)",
      backgroundColor: COLORS.lightGray,
    }}
  >
    <Outlet />
  </div>

    {/* Footer outside content-page */}
    <Footer />
  </div>
);

};

export default AdminLayout;
