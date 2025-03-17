import { useState } from "react";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
import { TextField, Button, Box, Container, Typography, Paper, Grid } from "@mui/material";
/* eslint-disable @typescript-eslint/no-explicit-any */

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e:any) => {
    e.preventDefault();
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
    if (result?.error) {
      setError("Invalid email or password");
    } else {
      router.push("/");
    }
  };

  return (
    <Container component="main" maxWidth="md" sx={{minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Paper elevation={3} sx={{ padding: 4, borderRadius: 2, width: "100%" }}>
        <Grid container spacing={2}>
          {/* Sidebar */}
          <Grid item xs={12} md={5} sx={{ backgroundColor: "gray", color: "white", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: 3, borderRadius: 2 }}>
            <Typography variant="h6" fontWeight="bold" align="center">Welcome to KD Electricals</Typography>
            <Typography variant="body1" align="center">sales.kdelectricals@gmail.com</Typography>
            <Typography variant="body2" align="center">Hingna, Nagpur, Maharashtra, India 41110</Typography>
          </Grid>
          
          {/* Login Form */}
          <Grid item xs={12} md={7}>
            <Box display="flex" flexDirection="column" alignItems="center">
              <Typography variant="h5" align="center" gutterBottom>
                Login
              </Typography>
              {error && <Typography color="error" align="center">{error}</Typography>}
              <Box component="form" onSubmit={handleLogin} sx={{ display: "flex", flexDirection: "column", gap: 5, width: "100%" }}>
                <TextField 
                  label="Email"
                  type="email"
                  fullWidth
                  variant="outlined"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <TextField 
                  label="Password"
                  type="password"
                  fullWidth
                  variant="outlined"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Button sx={{ backgroundColor: "green"}} type="submit" variant="contained" color="primary" fullWidth>
                  Login
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}