import { AppBar, Box, Button, Container, Toolbar, Typography } from "@mui/material"
import { logout } from "../api/auth";
import { useNavigate } from "react-router-dom";

export function Navbar() {
    const pages = ['Products', 'Pricing', 'Blog', 'Test'];
    const navigate = useNavigate();

    return(
        <AppBar position="fixed">
            <Toolbar sx={{ width: "100%", display: "flex", justifyContent: "space-between" }}>
                <Button onClick={() => logout(navigate)}>
                    Выйти
                </Button>
                <Box sx={{ display: "flex", gap: 2 }}>
                    {pages.map((page) => (
                        <Button key={page}>{page}</Button>
                    ))}
                </Box>
                <Typography>
                    Username
                </Typography>
            </Toolbar>
        </AppBar>
    )
}
 
export default Navbar