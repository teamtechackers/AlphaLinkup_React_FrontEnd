import React from "react";
import { COLORS } from "../../utils/theme/colors";
import { STYLES } from "../../utils/typography/styles";
import { CONSTANTS } from "../../utils/strings/constants";

const Footer: React.FC = () => {
  return (
    <footer className="border-top py-3 page-padding-1" style={ { backgroundColor: COLORS.lightGray } }>
      <div className="container-fluid px-3 d-flex flex-column flex-md-row align-items-center justify-content-between">
        {/* Left */}
        <div
          className="text-muted text-center text-md-start"
          style={STYLES.footer_text}
        >
          {CONSTANTS.VARIABLES.FOOTER.APP_TITLE}
        </div>

        {/* Right */}
        <div
          className="d-flex flex-wrap gap-3 justify-content-center mt-2 mt-md-0"
          style={STYLES.footer_text}
        >
          <a href="#" className="text-decoration-none text-muted">
            {CONSTANTS.VARIABLES.FOOTER.ABOUT_US}
          </a>
          <a href="#" className="text-decoration-none text-muted">
            {CONSTANTS.VARIABLES.FOOTER.HELP}
          </a>
          <a href="#" className="text-decoration-none text-muted">
            {CONSTANTS.VARIABLES.FOOTER.CONTACT_US}
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
