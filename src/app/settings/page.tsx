"use client";

import { Container, Typography, Card, CardContent, Box } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";

export default function SettingPage() {
  return (
    <Container maxWidth="sm" sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <Card sx={{ width: "100%", padding: 3, borderRadius: 4, boxShadow: 3, backgroundColor: "#ffffff" }}>
        <CardContent>
          <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
            <SettingsIcon color="primary" sx={{ fontSize: 40 }} />
          </Box>
          <Typography variant="h4" fontWeight="bold" textAlign="center" color="primary.dark" gutterBottom>
            Settings
          </Typography>
          <Typography variant="body1" textAlign="center" color="text.secondary">
            This page will be updated later. Stay tuned!
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
}
