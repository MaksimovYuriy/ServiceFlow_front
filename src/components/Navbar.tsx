import { AppBar, Box, Button, Container, Toolbar, Typography } from "@mui/material"

export function Navbar() {
    const pages = ['Products', 'Pricing', 'Blog', 'Test'];

    return(
        <AppBar position="fixed">
            <Toolbar sx={{ width: "100%", display: "flex", justifyContent: "space-between" }}>
                <Typography>
                    LOGO
                </Typography>
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