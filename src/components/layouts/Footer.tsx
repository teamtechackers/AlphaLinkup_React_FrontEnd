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
          <button type="button" className="btn btn-link text-decoration-none text-muted p-0 border-0 bg-transparent" style={{...STYLES.footer_text, cursor: 'pointer'}}>
            {CONSTANTS.VARIABLES.FOOTER.ABOUT_US}
          </button>
          <button type="button" className="btn btn-link text-decoration-none text-muted p-0 border-0 bg-transparent" style={{...STYLES.footer_text, cursor: 'pointer'}}>
            {CONSTANTS.VARIABLES.FOOTER.HELP}
          </button>
          <button type="button" className="btn btn-link text-decoration-none text-muted p-0 border-0 bg-transparent" style={{...STYLES.footer_text, cursor: 'pointer'}}>
            {CONSTANTS.VARIABLES.FOOTER.CONTACT_US}
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
