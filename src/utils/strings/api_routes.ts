
export const API_ROUTES = {
  
  LOGIN: "/admin-login",
  LOGOUT: "/admin-logout",
  DASHBOARD: "/admin-dashboard",

  GLOBAL_API: {
    API_COUNTRY_LIST: "/Api-Country-List",
    API_STATE_LIST: "/Api-State-List",
    API_CITY_LIST: "/Api-City-List",
    API_PAY_LIST: "/Api-Pay-List",
    API_JOB_TYPE_LIST: "/Api-Job-Type-List",
    API_EVENT_MODE_LIST: "/Api-Event-Mode-List",
    API_EVENT_TYPE_LIST: "/Api-Event-Type-List",
    API_EMPLOYMENT_TYPE_LIST: "/Api-Employment-Type-List",
    API_USER_LIST: "/Api-User-List",
    API_INDUSTRY_TYPE_LIST: "/Api-Industry-Type-List",
    API_ALL_SERVICES_LIST: "/Api-All-Services-List",
    API_FUND_SIZE_LIST: "/Api-Fund-Size-List",
  },

  COUNTRY_LIST: {
    GET: "/list-country",
    GET_AJAX: "/list-country-ajax",
    SAVE: "/save-country",
    EDIT: "/edit-country",
    DELETE: "/delete-country",
    CHECK_DUPLICATE: "/check-duplicate-country",
  },

  STATE_LIST: {
    GET: "/list-state",
    SAVE: "/submit-state",
    EDIT: "/edit-state",
    DELETE: "/delete-state",
    GET_AJAX: "/list-state-ajax",
    CHECK_DUPLICATE: "/check-duplicate-state",
  },

  CITY_LIST: {
    GET: "/list-cities-ajax",
    SAVE: "/submit-city",
    EDIT: "/edit-city",
    DELETE: "/delete-city",
    CHECK_DUPLICATE: "/check-duplicate-cities",
  },

  EMPLOYMENT_TYPE: {
    GET: "/list-employment-type",
    GET_AJAX: "/list-employment-type-ajax",
    SAVE: "/submit-employment-type",
    EDIT: "/edit-employment-type",
    DELETE: "/delete-employment-type",
    CHECK_DUPLICATE: "/check-duplicate-employment-type",
  },

  INTERESTS: {
    GET: "/list-interests",
    GET_AJAX: "/list-interest-ajax",
    SAVE: "/submit-interest",
    EDIT: "/edit-interests",
    DELETE: "/delete-interest",
    CHECK_DUPLICATE: "/check-duplicate-interest",
  },

  JOB_TYPE: {
    GET_AJAX: "/list-job-type-ajax",
    SUBMIT: "/submit-job-type",
    DELETE: "/delete-job-type",
    CHECK_DUPLICATE: "/check-duplicate-job-type",
  },

  PAY: {
    GET_AJAX: "/list-pay-ajax",
    SUBMIT: "/submit-pay",
    DELETE: "/delete-pay",
    CHECK_DUPLICATE: "/check-duplicate-pay",
  },

  EVENT_MODES: {
    GET_AJAX: "/list-event-mode-ajax",
    SUBMIT: "/submit-event-mode",
    DELETE: "/delete-event-mode",
    CHECK_DUPLICATE: "/check-duplicate-event-mode",
  },

  EVENT_TYPE: {
    GET_AJAX: "/list-event-type-ajax",
    SUBMIT: "/submit-event-type",
    DELETE: "/delete-event-type",
    CHECK_DUPLICATE: "/check-duplicate-event-type",
  },

  INDUSTRY_TYPE: {
    GET: "/list-industry-type",
    SAVE: "/submit-industry-type",
    EDIT: "/edit-industry-type",
    DELETE: "/delete-industry-type",
    CHECK_DUPLICATE: "/check-duplicate-industry-type",
  },

  FUND_SIZE: {
    GET: "/list-fund-size",
    SAVE: "/submit-fund-size",
    EDIT: "/edit-fund-size",
    DELETE: "/delete-fund-size",
    CHECK_DUPLICATE: "/check-duplicate-fund-size",
  },

  FOLDERS: {
    GET: "/list-folders",
    SAVE: "/submit-folders",
    EDIT: "/edit-folder",
    DELETE: "/delete-folders",
    CHECK_DUPLICATE: "/check-duplicate-folders",
  },

  USERS: {
    GET_AJAX: "/list-users-ajax",
    SUBMIT: "/submit-users",
    DELETE: "/delete-users",
    CHECK_DUPLICATE: "/check-duplicate-users",
  },

  JOBS: {
    GET_AJAX: "/list-jobs-ajax",
    SUBMIT: "/submit-jobs",
    DELETE: "/delete-jobs",
    CHECK_DUPLICATE: "/check-duplicate-job",
  },

  EVENTS: {
    GET_AJAX: "/list_events_ajax",
    SUBMIT: "/submit-events",
    DELETE: "/delete-events",
    CHECK_DUPLICATE: "/check-duplicate-event",
  },

  CARD_ACTIVATION: {
    GET_AJAX: "/list-card-activation-requests-ajax",
    SUBMIT: "/submit-card-activation-requests",
    DELETE: "/delete-card-activation-requests",
    CHECK_DUPLICATE: "/check-duplicate-card-activation-requests",
  },

  SERVICE_PROVIDERS: {
    GET_AJAX: "/list-service-provider-ajax",
    SUBMIT: "/submit-service-provider",
    DELETE: "/delete-service-provider",
    CHECK_DUPLICATE: "/check-duplicate-service-provider",
  },

  INVESTORS: {
    GET_AJAX: "/list-investors-ajax",
    SUBMIT: "/submit-investors",
    DELETE: "/delete-investors",
    CHECK_DUPLICATE: "/check-duplicate-investor",
  },
};
