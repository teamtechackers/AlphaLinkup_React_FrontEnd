import React from "react";
import { COLORS } from "../utils/theme/colors";

const PermissionTableMessage: React.FC<{ message?: string }> = ({
  message = "You do not have permission to see this content",
}) => {
  return (
    <div
      style={{
        minHeight: 180,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        color: COLORS.red,
        fontWeight: 600,
        padding: "1rem",
      }}
    >
      {message}
    </div>
  );
};

export default PermissionTableMessage;
