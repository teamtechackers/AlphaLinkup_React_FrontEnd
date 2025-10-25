import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  useTheme,
  useMediaQuery,
} from "@mui/material";

const DetailsDialog = ({ open, onClose, title, fields }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const chunkArray = (arr, chunkSize) => {
    const result = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
      result.push(arr.slice(i, i + chunkSize));
    }
    return result;
  };

  const rows = chunkArray(fields, 3);

  const getRowSpacing = () => {
    if (isSmallScreen) return 16;
    const spacing = Math.min(48, 24 + rows.length * 4);
    return spacing;
  };

  const rowSpacing = getRowSpacing();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      PaperProps={{
        style: {
          width: "800px",
          height: "600px",
          overflow: "hidden",
        },
      }}
    >
      <DialogTitle>{title}</DialogTitle>

      <DialogContent
        dividers
        sx={{
          height: "calc(100% - 64px)",
          overflowY: "auto",
          padding: 3,
        }}
      >
        {rows.map((row, rowIndex) => {
          const isLastRow = rowIndex === rows.length - 1;
          const missingColumns = 3 - row.length;

          return (
            <Box
              display="flex"
              gap={2}
              mb={`${rowSpacing}px`}
              key={rowIndex}
              justifyContent="flex-start"
              flexWrap="nowrap"
            >
              {row.map((field, colIndex) => {
                const labelLower = field.label?.toLowerCase() || "";
                const isJobDescription = labelLower === "job description";
                const isEventBanner = labelLower === "event banner";

                return (
                  <Box
                    key={colIndex}
                    minWidth={200}
                    flex={isJobDescription ? "0 0 66%" : "1"}
                  >
                    <Box fontWeight="bold" mb={0.5}>
                      {field.label}:
                    </Box>

                    <Box whiteSpace="pre-wrap">
                      {isEventBanner ? (
                        <img
                          src={field.value}
                          alt={field.label}
                          style={{
                            width: "100%",
                            height: "200px",
                            objectFit: "cover",
                            borderRadius: 6,
                          }}
                        />
                      ) : field.value &&
                        /\.(jpeg|jpg|gif|png|webp|svg)$/.test(field.value) ? (
                        <img
                          src={field.value}
                          alt={field.label}
                          style={{
                            maxWidth: "100%",
                            maxHeight: 150,
                            height: "auto",
                            borderRadius: 4,
                          }}
                        />
                      ) : (
                        field.value || "-"
                      )}
                    </Box>
                  </Box>
                );
              })}

              {/* Fill empty spots in last row to keep alignment */}
              {isLastRow &&
                missingColumns > 0 &&
                Array.from({ length: missingColumns }).map((_, i) => (
                  <Box key={`empty-${i}`} flex="1" visibility="hidden" />
                ))}
            </Box>
          );
        })}
      </DialogContent>
    </Dialog>
  );
};

export default DetailsDialog;
