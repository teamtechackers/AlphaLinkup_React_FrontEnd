export const CONSTANTS = {

  APP: {
    TITLE: "Alpha Linkup",
  },

  BUTTONS: {
    SAVE: "Save",
    UPDATE: "Update",
    DELETE: "Delete",
    CANCEL: "Cancel",
  },

  MESSAGE_TAGS: {
    SUCCESS: "success",
    ERROR: "error",
    WARNING: "warning",
    INFO: "info",
    INVALID: "invalid",
  } as const,

  MESSAGES: {
    SAVE_SUCCESS: "Data saved successfully!",
    UPDATE_SUCCESS: "Data updated successfully!",
    DELETE_SUCCESS: "Data deleted successfully!",
    FETCH_SUCCESS: "Data fetched successfully!",
    LOGIN_SUCCESS: "Logged in successfully!",
    LOGOUT_SUCCESS: "Logged out successfully!",

    SAVE_FAILED: "Failed to save data!",
    UPDATE_FAILED: "Failed to update data!",
    DELETE_FAILED: "Failed to delete data!",
    FETCH_FAILED: "Failed to fetch data!",
    LOGIN_FAILED: "Login failed. Please check your credentials.",
    LOGOUT_FAILED: "Logout failed. Please try again.",

    DELETE_CONFIRM: "Are you sure you want to delete?",
    LOGOUT_CONFIRM: "Are you sure you want to logout?",
    UNSAVED_CHANGES: "You have unsaved changes. Do you want to continue?",
    INVALID_INPUT: "Invalid input. Please check the entered values.",
    PERMISSION_DENIED: "You do not have permission to perform this action.",
    CONNECTION_ERROR: "Unable to connect to the backend.",
    LOADING_DATA: "Loading Data ...",
    RETRY_CONNECTION: "Retry Connection",
    INTERNAL_ERROR: "An internal error occurred. Please try again later.",
    SOMETHING_WENT_WRONG: "Something went wrong. Please try again later.",
    DUPLICATE_FOUND: "Duplicate mobile/email found",
  },

   MAX_LENGTHS:{
    FIELD_50: 50,
    FIELD_100: 100,
    FIELD_150: 150,
    FIELD_200: 200,
  },
  
  VARIABLES: {
    HEADER: {
      WELCOME: 'Welcome !',
      LOGOUT: 'Logout',
    },
    FOOTER: {
      APP_TITLE: '2024 &copy; Alpha Linkup',
      ABOUT_US: 'About Us',
      HELP: 'Help',
      CONTACT_US: 'Contact Us',
    },
  },
};
