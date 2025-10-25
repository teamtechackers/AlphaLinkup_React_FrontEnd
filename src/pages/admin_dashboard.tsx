import React, { useState, useEffect, useCallback } from 'react';
import { STYLES } from "../utils/typography/styles";
import { FiBriefcase, FiBarChart2 , FiUsers, FiAperture, FiStar, FiHeadphones } from "react-icons/fi";
import { COLORS } from '../utils/theme/colors';
import { CONSTANTS } from "../utils/strings/constants";
import { DASHBOARD_STRINGS } from '../utils/strings/pages/dashboard_strings';
import { DashboardModel } from '../models/dashboard_model';
import authService from '../services/auth_service';
import dashboardService from '../services/dashboard_service';

const AdminDashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const currentUser = authService.getUser();
      const userId = currentUser.user_id || undefined;
      const data = await dashboardService.getDashboardData(userId);

      if (data && data.status === true && data.rcode === 200) {
        const formattedData: DashboardModel = {
          count_users: Number(data.count_users ?? 0),
          count_jobs: Number(data.count_jobs ?? 0),
          count_events: Number(data.count_events ?? 0),
          count_service: Number(data.count_service ?? 0),
          count_investor: Number(data.count_investor ?? 0),
          list_jobs: Array.isArray(data.list_jobs) ? data.list_jobs : [],
          list_investor: Array.isArray(data.list_investor) ? data.list_investor : [],
        };

        setDashboardData(formattedData);
      } else {
        throw new Error(data.message || CONSTANTS.MESSAGE_TAGS.INVALID);
      }
    } catch (err) {
      console.error(`${CONSTANTS.MESSAGES.FETCH_FAILED}: `, err);
      setError(CONSTANTS.MESSAGES.CONNECTION_ERROR);
    } finally {
      setLoading(false);
    }
  }, [retryCount]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleRetry = () => {
    if (retryCount >= 3) return;
    setRetryCount(prev => prev + 1);
    fetchDashboardData();
  };

  if (loading) {
    return (
      <div className="content" style={STYLES.page_title}>
        <div className="container">
          <h4 className="page-title">Dashboard</h4>
          <div className="loading-box">
            <div className="spinner"></div>
            <p>{CONSTANTS.MESSAGES.LOADING_DATA}</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="content" style={STYLES.page_title}>
        <div className="container">
          <h4 className="page-title">Dashboard</h4>

          <div className="alert alert-warning">
            <h5>{CONSTANTS.MESSAGES.CONNECTION_ERROR}</h5>
            <p>{error}</p>
            <button className="btn btn-outline-warning" onClick={handleRetry}>
              {CONSTANTS.MESSAGES.RETRY_CONNECTION}
            </button>
            <small>Retry attempt: {retryCount + 1}</small>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="content">
      <div className="container-fluid">
        
        {/* Page Title */}
        <div className="row">
          <div className="col-12">
            <div style={STYLES.page_title}>
                {DASHBOARD_STRINGS.TITLE}
              </div>
          </div>
        </div>

        <div className="row">

          {/* Users */}
          <div className="col-md-6 col-xl-3 mb-4">
            <div className="card shadow-sm border-0 py-2">
              <div className="d-flex align-items-center p-3">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center"
                  style={{ backgroundColor: `${COLORS.purple}30`, border: `1px solid ${COLORS.purple}`, height: "4.5rem", width: "4.5rem" }} >
                  <span style={{ color: COLORS.purple }}>
                    <FiUsers size={24} />
                  </span>
                </div>
                <div className="ms-auto text-end mr-2">
                  <h4 className="m-3" style={STYLES.label_2} >{dashboardData?.count_users || 0}</h4>
                  <p className="text-muted small m-0" style={STYLES.field_text} >{DASHBOARD_STRINGS.CARDS.USERS}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Jobs */}
          <div className="col-md-6 col-xl-3 mb-4">
            <div className="card shadow-sm border-0 py-2">
              <div className="d-flex align-items-center p-3">
                <div className="rounded-circle d-flex align-items-center justify-content-center"
                 style={{ backgroundColor: `${COLORS.green}30`, border: `1px solid ${COLORS.green}`, height: "4.5rem", width: "4.5rem" }} >
                  <span style={{ color: COLORS.green }}>
                    <FiBriefcase size={24}/>
                  </span>
                </div>
                <div className="ms-auto text-end mr-2">
                  <h4 className="m-3" style={STYLES.label_2} >{dashboardData?.count_jobs || 0}</h4>
                  <p className="text-muted small m-0" style={STYLES.field_text} >{DASHBOARD_STRINGS.CARDS.JOBS}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Events */}
          <div className="col-md-6 col-xl-3 mb-4">
            <div className="card shadow-sm border-0 py-2">
              <div className="d-flex align-items-center p-3">
                <div className="rounded-circle d-flex align-items-center justify-content-center"
                 style={{ backgroundColor: `${COLORS.teal}30`, border: `1px solid ${COLORS.teal}`, height: "4.5rem", width: "4.5rem" }} >
                  <span style={{ color: COLORS.teal }}>
                    <FiAperture size={24}/>
                  </span> 
                </div>
                <div className="ms-auto text-end mr-2">
                  <h4 className="m-3" style={STYLES.label_2} >{dashboardData?.count_events || 0}</h4>
                  <p className="text-muted small m-0" style={STYLES.field_text} >{DASHBOARD_STRINGS.CARDS.EVENTS}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Service Providers */}
          <div className="col-md-6 col-xl-3 mb-4">
            <div className="card shadow-sm border-0 py-2">
              <div className="d-flex align-items-center p-3">
                <div className="rounded-circle d-flex align-items-center justify-content-center"
                 style={{ backgroundColor: `${COLORS.yellow}30`, border: `1px solid ${COLORS.yellow}`, height: "4.5rem", width: "4.5rem" }} >
                  <span style={{ color: COLORS.yellow }}>
                    <FiStar size={24}/>
                  </span>
                </div>
                <div className="ms-auto text-end mr-2">
                  <h4 className="m-3" style={STYLES.label_2} >{dashboardData?.count_service || 0}</h4>
                  <p className="text-muted small m-0" style={STYLES.field_text} >{DASHBOARD_STRINGS.CARDS.SERVICE_PROVIDERS}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Investors */}
          <div className="col-md-6 col-xl-3 mb-4">
            <div className="card shadow-sm border-0 py-2">
              <div className="d-flex align-items-center p-3">
                <div className="rounded-circle d-flex align-items-center justify-content-center"
                 style={{ backgroundColor: `${COLORS.yellow}30`, border: `1px solid ${COLORS.yellow}`, height: "4.5rem", width: "4.5rem" }} >
                  <span style={{ color: COLORS.yellow }}>
                    <FiBarChart2 size={24}/>
                  </span>
                </div>
                <div className="ms-auto text-end mr-2">
                  <h4 className="m-3" style={STYLES.label_2} >{dashboardData?.count_investor || 0}</h4>
                  <p className="text-muted small m-0" style={STYLES.field_text} >{DASHBOARD_STRINGS.CARDS.INVESTORS}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Meetings Schedules */}
          <div className="col-md-6 col-xl-3 mb-4">
            <div className="card shadow-sm border-0 py-2">
              <div className="d-flex align-items-center p-3">
                <div className="rounded-circle d-flex align-items-center justify-content-center"
                 style={{ backgroundColor: `${COLORS.teal}30`, border: `1px solid ${COLORS.teal}`, height: "4.5rem", width: "4.5rem" }} >
                  <span style={{ color: COLORS.teal }}>
                    <FiHeadphones size={24}/>
                  </span>
                </div>
                <div className="ms-auto text-end mr-2">
                  <h4 className="m-3" style={STYLES.label_2} >{3}</h4>
                  <p className="text-muted small m-0" style={STYLES.field_text} >{DASHBOARD_STRINGS.CARDS.MEETINGS_SCHEDULES}</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Tables Row */}
        <div className="row equal-height">
          
          <div className="col-xl-6">
            <div className="card-box p-4" style={{ backgroundColor: COLORS.white, borderRadius: "0.5rem"  }}>
              <h4 className="header-title mb-3" style={STYLES.table_title}>{DASHBOARD_STRINGS.TABLE_JOBS.TABLE_TITLE}</h4>
              <div className="table-container">
                <table className="custom-table">
                  <thead>
                    <tr style={{ backgroundColor: COLORS.lightGray, }}>
                      <th style={{ ...STYLES.table_header, fontWeight: "bold" }}>{DASHBOARD_STRINGS.TABLE_JOBS.JOBE_TITLE}</th>
                      <th style={{ ...STYLES.table_header, fontWeight: "bold" }}>{DASHBOARD_STRINGS.TABLE_JOBS.COMPANY_NAME}</th>
                      <th style={{ ...STYLES.table_header, fontWeight: "bold" }}>{DASHBOARD_STRINGS.TABLE_JOBS.ADDRESS}</th>
                      <th style={{ ...STYLES.table_header, fontWeight: "bold" }}>{DASHBOARD_STRINGS.TABLE_JOBS.CITY}</th>
                      <th style={{ ...STYLES.table_header, fontWeight: "bold" }}>{DASHBOARD_STRINGS.TABLE_JOBS.STATE}</th>
                      <th style={{ ...STYLES.table_header, fontWeight: "bold" }}>{DASHBOARD_STRINGS.TABLE_JOBS.COUNTRY }</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData?.list_jobs?.length ? (
                      dashboardData.list_jobs.map((job, i) => (
                        <tr key={i}>
                          <td style={STYLES.table_row}>{job.job_title}</td>
                          <td style={STYLES.table_row}>{job.company_name}</td>
                          <td style={STYLES.table_row}>{job.address}</td>
                          <td style={STYLES.table_row}>{job.city_name}</td>
                          <td style={STYLES.table_row}>{job.state_name}</td>
                          <td style={STYLES.table_row}>{job.country_name}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} style={STYLES.label}>{DASHBOARD_STRINGS.ERROR}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="col-xl-6">
            <div className="card-box p-4" style={{ backgroundColor: COLORS.white, borderRadius: "0.5rem"}}>
              <h4 className="mb-3" style={STYLES.table_title}>{DASHBOARD_STRINGS.TABLE_INVESTORS.TABLE_TITLE}</h4>
              <div className="table-container">
                <table className="custom-table">
                  <thead>
                    <tr style={{ backgroundColor: COLORS.lightGray }}>
                      <th style={{ ...STYLES.table_header, fontWeight: "bold" }}>{DASHBOARD_STRINGS.TABLE_INVESTORS.REFERENCE_NO}</th>
                      <th style={{ ...STYLES.table_header, fontWeight: "bold" }}>{DASHBOARD_STRINGS.TABLE_INVESTORS.NAME}</th>
                      <th style={{ ...STYLES.table_header, fontWeight: "bold" }}>{DASHBOARD_STRINGS.TABLE_INVESTORS.BIO}</th>
                      <th style={{ ...STYLES.table_header, fontWeight: "bold" }}>{DASHBOARD_STRINGS.TABLE_INVESTORS.CITY}</th>
                      <th style={{ ...STYLES.table_header, fontWeight: "bold" }}>{DASHBOARD_STRINGS.TABLE_INVESTORS.STATE}</th>
                      <th style={{ ...STYLES.table_header, fontWeight: "bold" }}>{DASHBOARD_STRINGS.TABLE_INVESTORS.COUNTRY}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData?.list_investor?.length ? (
                      dashboardData.list_investor.map((inv, i) => (
                        <tr key={i}>
                          <td style={STYLES.table_row}>{inv.reference_no}</td>
                          <td style={STYLES.table_row}>{inv.name}</td>
                          <td style={STYLES.table_row}>{inv.bio}</td>
                          <td style={STYLES.table_row}>{inv.city_name}</td>
                          <td style={STYLES.table_row}>{inv.state_name}</td>
                          <td style={STYLES.table_row}>{inv.country_name}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} style={STYLES.label}>{DASHBOARD_STRINGS.ERROR}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
