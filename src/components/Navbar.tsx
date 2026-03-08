import { AppBar, Button, Toolbar, Typography } from "@mui/material"
import { logout } from "../api/auth";
import { useNavigate } from "react-router-dom";

export function Navbar() {
    const navigate = useNavigate();

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
                <Button onClick={() => logout(navigate)}>
                    Выйти
                </Button>
            </Toolbar>
        </AppBar>
    )
}

export default Navbar
