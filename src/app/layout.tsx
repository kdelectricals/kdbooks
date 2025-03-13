"use client";

import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import Sidebar from "@/app/components/Sidebar";
import { SessionProvider } from "next-auth/react";

const theme = createTheme({
  palette: {
    primary: { main: "#1976d2" },
    secondary: { main: "#dc004e" },
  },
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider> {/* ✅ Wrap the entire layout in SessionProvider */}
      <html lang="en">
        <body>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#f3f4f6" }}>
              <Sidebar />
              <main style={{ flexGrow: 1, padding: "20px" }}>{children}</main>
            </div>
          </ThemeProvider>
        </body>
      </html>
    </SessionProvider>
  );
}
