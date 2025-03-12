"use client";

import { useRouter } from "next/navigation";
import { Container, Typography, Button, Box } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

export default function Unauthorized() {
  const router = useRouter();

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        textAlign: "center",
      }}
    >
      <Box
        sx={{
          backgroundColor: "#ffeaea",
          padding: "20px",
          borderRadius: "50%",
        }}
      >
        <LockOutlinedIcon sx={{ fontSize: 60, color: "red" }} />
      </Box>

      <Typography variant="h4" fontWeight="bold" mt={2}>
        Access Denied
      </Typography>

      <Typography variant="body1" color="text.secondary" mt={1}>
        You do not have permission to view this page.
      </Typography>

      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 3, borderRadius: "8px" }}
        onClick={() => router.push("/")}
      >
        Go to Homepage
      </Button>
    </Container>
  );
}
