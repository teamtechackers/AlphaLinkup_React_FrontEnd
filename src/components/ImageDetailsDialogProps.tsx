import React from "react";
import { Dialog, DialogTitle, DialogContent, Box, useTheme, useMediaQuery } from "@mui/material";

interface ImageDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  fields: { label: string; value: any }[];
  imageUrl?: string;
}

const ImageDetailsDialog: React.FC<ImageDetailsDialogProps> = ({ open, onClose, title, fields, imageUrl }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const chunkArray = (arr: any[], chunkSize: number) => {
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
    <Dialog open={open} onClose={onClose} maxWidth="lg">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        {imageUrl && (
          <Box display="flex" justifyContent="center" mb={4}>
            <img
              src={imageUrl}
              alt="Dialog Image"
              style={{
                width: 120,
                height: 120,
                borderRadius: "50%",
                objectFit: "cover",
                border: `2px solid ${theme.palette.primary.main}`,
              }}
            />
          </Box>
        )}

        {rows.map((row, rowIndex) => {
          const isLastRow = rowIndex === rows.length - 1;

          return (
            <Box
              display="flex"
              gap={2}
              mb={`${rowSpacing}px`}
              key={rowIndex}
              justifyContent="flex-start"
            >
              {row.map((field, colIndex) => (
                <Box key={colIndex} minWidth={200} flex={isLastRow ? "0 0 auto" : 1}>
                  <Box fontWeight="bold" mb={0.5}>
                    {field.label}:
                  </Box>
                  <Box>
                    {field.value && /\.(jpeg|jpg|gif|png|webp|svg)$/.test(field.value) ? (
                      <img
                        src={field.value}
                        alt={field.label}
                        style={{ maxWidth: "100%", maxHeight: 150, height: "auto", borderRadius: 4 }}
                      />
                    ) : (
                      field.value || "-"
                    )}
                  </Box>
                </Box>
              ))}
            </Box>
          );
        })}
      </DialogContent>
    </Dialog>
  );
};

export default ImageDetailsDialog;
