import React from 'react';
import { Outlet, useNavigate} from 'react-router-dom';
import authService from '../../services/auth_service';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { COLORS } from '../../utils/theme/colors';
import { APP_ROUTES } from '../../utils/strings/app_routes';

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();

  const user = authService.getUser();

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
    <Header user={user} onLogout={handleLogout} />

    {/* Sidebar */}
    <Sidebar />

    {/* Main Content */}
    <div
      className="content-page"
      style={{
        backgroundColor: COLORS.lightGray,
        flex: "1",
        display: "flex",
        flexDirection: "column",
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
