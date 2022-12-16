import { Alert, Box, Collapse, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React from "react";

const AlertPopup = ({
  open,
  closeFun,
  children,
  severity = "error",
  sx = {},
  autoClose = false,
}) => {
  React.useEffect(() => {
    if (autoClose) {
      setTimeout(() => {
        closeFun();
      }, 5000);
    }
  }, [autoClose, closeFun]);
  return (
    <Box sx={{ width: "450px", position: "fixed", top: 0, ...sx }}>
      <Collapse in={open}>
        <Alert
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={closeFun}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          severity={severity}
        >
          {children}
        </Alert>
      </Collapse>
    </Box>
  );
};

export default AlertPopup;
