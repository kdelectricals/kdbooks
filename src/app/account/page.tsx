"use client";

import { useSession, signOut } from "next-auth/react";
import { Avatar, Box, Typography, Button, TextField, IconButton, Paper } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import LogoutIcon from "@mui/icons-material/Logout";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Account() {
  const { data: session, status } = useSession();
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  if (status === "loading") {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        Loading...
      </Box>
    );
  }

  if (!session?.user) {
    return (
      <Typography variant="h6" textAlign="center" mt={5}>
        Not authenticated. Please log in.
      </Typography>
    );
  }

  const user = session.user;

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f5f5", display: "flex", justifyContent: "center", alignItems: "center", p: 3 }}>
      <Paper elevation={3} sx={{ width: "100%", maxWidth: 600, p: 4, borderRadius: 3, bgcolor: "white" }}>
        {/* Profile Header */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <Box sx={{ position: "relative", mr: 2 }}>
            <Avatar src={user.profilePicture || "/default-avatar.png"} sx={{ width: 90, height: 90 }} />
            <IconButton
              sx={{
                position: "absolute",
                bottom: 5,
                right: 5,
                backgroundColor: "white",
                boxShadow: 2,
                "&:hover": { bgcolor: "#ddd" }
              }}
              size="small"
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Box>
          <Box>
            <Typography variant="h5" fontWeight="bold">
              {user.firstName} {user.lastName}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {user.role}
            </Typography>
          </Box>
        </Box>

        {/* User Details - Read-Only Fields */}
        <Box sx={{ display: "grid", gap: 2 }}>
          <TextField label="Username" value={user.userName} fullWidth disabled />
          <TextField label="Email" value={user.userName} fullWidth disabled />
          <TextField label="Mobile Number" value={user.phone || "Not provided"} fullWidth disabled />
          <TextField label="Location" value={user.address || "Nagpur"} fullWidth disabled />
        </Box>

        {/* Logout Button */}
        <Button
          variant="contained"
          color="success"
          startIcon={<LogoutIcon />}
          sx={{ mt: 3, width: "100%", py: 1.5, fontSize: "1rem", borderRadius: 2 }}
          onClick={async () => {
            await signOut({ redirect: false });
            router.push("/login");
          }}
        >
          Logout
        </Button>
      </Paper>
    </Box>
  );
}
