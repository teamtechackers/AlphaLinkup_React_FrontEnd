import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import "./App.css";

import AdminLogin from './pages/admin_login';
import AdminDashboard from './pages/admin_dashboard';
import UsersList from './pages/users_list';
import JobsList from './pages/jobs_list';
import EventsList from './pages/events_list';
import InvestorsList from './pages/investors_list';
import ServiceProvidersList from './pages/service_providers_list';
import CardActivationRequestsList from './pages/card_activation_requests_list';
import CountriesList from './pages/countries_list';
import StatesList from './pages/states_list';
import CitiesList from './pages/cities_list';
import EmploymentTypesList from './pages/employment_types_list';
import InterestsList from './pages/interests_list';
import JobTypesList from './pages/job_types_list';
import PayList from './pages/pay_list';
import EventModesList from './pages/event_modes_list';
import EventTypesList from './pages/event_types_list';
import IndustriesTypeList from './pages/industries_type_list';
import FundSizesList from './pages/fund_sizes_list';
import FoldersList from './pages/folders_list';
import MeetingsSchedulesPage from './pages/metings_schedules';
import AdminLayout from './components/layouts/AdminLayout';
import { APP_ROUTES } from './utils/strings/app_routes';
import authService from './services/auth_service';
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const sessionValid = authService.checkSession();
  if (!sessionValid) {
    return <Navigate to={APP_ROUTES.LOGIN} replace />;
  }
  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path={APP_ROUTES.LOGIN} element={<AdminLogin />} />

      {/* 404 */}
      <Route path={APP_ROUTES.NOT_FOUND} element={<AdminLogin />} />
      
      {/* Protected Admin Routes */}
      <Route path={APP_ROUTES.ROOT} element={ <ProtectedRoute> <AdminLayout /> </ProtectedRoute> }>
        <Route index element={<Navigate to={APP_ROUTES.DASHBOARD} replace />} />
        <Route path={APP_ROUTES.DASHBOARD} element={<AdminDashboard />} />
        <Route path={APP_ROUTES.USERS} element={<UsersList />} />
        <Route path={APP_ROUTES.JOBS} element={<JobsList />} />
        <Route path={APP_ROUTES.EVENTS} element={<EventsList />} />
        <Route path={APP_ROUTES.INVESTORS} element={<InvestorsList />} />
        <Route path={APP_ROUTES.SERVICE_PROVIDERS} element={<ServiceProvidersList />} />
        <Route path={APP_ROUTES.CARD_ACTIVATION_REQUESTS} element={<CardActivationRequestsList />} />
        <Route path={APP_ROUTES.MEETINGS_SCHEDULES} element={<MeetingsSchedulesPage />} />
   
        {/* Masters */}
        <Route path={APP_ROUTES.COUNTRIES} element={<CountriesList />} />
        <Route path={APP_ROUTES.STATES} element={<StatesList />} />
        <Route path={APP_ROUTES.CITIES} element={<CitiesList />} />
        <Route path={APP_ROUTES.EMPLOYMENT_TYPES} element={<EmploymentTypesList />} />
        <Route path={APP_ROUTES.INTERESTS} element={<InterestsList />} />
        <Route path={APP_ROUTES.JOB_TYPES} element={<JobTypesList />} />
        <Route path={APP_ROUTES.PAY} element={<PayList />} />
        <Route path={APP_ROUTES.EVENT_MODES} element={<EventModesList />} />
        <Route path={APP_ROUTES.EVENT_TYPES} element={<EventTypesList />} />
        <Route path={APP_ROUTES.INDUSTRY_TYPES} element={<IndustriesTypeList />} />
        <Route path={APP_ROUTES.FUND_SIZES} element={<FundSizesList />} />
        <Route path={APP_ROUTES.FOLDERS} element={<FoldersList />} />
      </Route>
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <ToastContainer position="top-right" autoClose={3000} />
        <AppRoutes />
      </div>
    </Router>
  );
};

export default App;
