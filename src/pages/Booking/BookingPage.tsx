import { Box, FormControl, Select, MenuItem, InputLabel, Paper, Typography, Button } from "@mui/material";
import { useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { ru } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import theme from "../../theme";


export function BookingPage() {
    const navigate = useNavigate();
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    const toLogin = () => {
        navigate("/login")
    }

    const bookingHandle = () => {
        console.log("booking process")
    }

    return (
        <Box sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
            <Paper sx={{minWidth: '100vh', gap: 2}}>
                <Typography variant="h5" component="h1" textAlign="center" mb={2}>
                    Запись в наш центр
                </Typography>
                <FormControl variant="standard" sx={{m: 1, minWidth: '100%'}}>
                    <InputLabel id="service-label">Выберите услугу</InputLabel>
                    <Select label="Service" MenuProps={{
                        PaperProps: {
                            sx: {
                                width: 'auto',
                                display: 'inline-block'
                            }
                        }
                    }}>
                        
                    </Select>
                </FormControl>
                <FormControl variant="standard" sx={{m: 1, minWidth: '100%'}}>
                    <InputLabel id="service-label">Выберите мастера</InputLabel>
                    <Select label="Service" MenuProps={{
                        PaperProps: {
                            sx: {
                                width: 'auto',
                                display: 'inline-block'
                            }
                        }
                    }}>
                        
                    </Select>
                </FormControl>
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ru}>
                    <DatePicker
                        label="Выберите дату"
                        value={selectedDate}
                        onChange={(newValue) => setSelectedDate(newValue)}
                        slotProps={{
                        textField: { fullWidth: true },
                        }}
                    />
                </LocalizationProvider>
                <FormControl variant="standard" sx={{m: 1, minWidth: '100%'}}>
                    <InputLabel id="service-label">Выберите время</InputLabel>
                    <Select label="Service" MenuProps={{
                        PaperProps: {
                            sx: {
                                width: 'auto',
                                display: 'inline-block'
                            }
                        }
                    }}>
                        
                    </Select>
                </FormControl>
                <Button type="submit" onClick={bookingHandle}>
                    Подтвердить
                </Button>
            </Paper>
            <Button type="submit" onClick={toLogin} sx={{backgroundColor: theme.palette.secondary.light}}>
                Вход сотрудника
            </Button>
        </Box>
    );
}

export default BookingPage;