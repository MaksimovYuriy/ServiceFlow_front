import { AppBar, Button, Toolbar, Typography } from "@mui/material"
import { logout } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

export function Navbar() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const handleLogout = async () => {
        await logout(navigate);
        queryClient.clear();
    };

    return(
        <AppBar position="fixed">
            <Toolbar sx={{ width: "100%", display: "flex", justifyContent: "space-between" }}>
                <Typography
                    variant="h6"
                    sx={{ cursor: "pointer" }}
                    onClick={() => navigate("/admin/dashboard")}
                >
                    ServiceFlow
                </Typography>
                <Button onClick={handleLogout}>
                    Выйти
                </Button>
            </Toolbar>
        </AppBar>
    )
}

export default Navbar
