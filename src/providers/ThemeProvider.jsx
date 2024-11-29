import { createTheme, ThemeProvider as MaterialThemeProvider } from '@mui/material';

const theme = createTheme({
    breakpoints: {
        values: {
            xs: 0,      // Extra small
            sm: 480,    // Small
            md: 768,    // Medium
            lg: 1024,   // Large
            xl: 1280,   // Extra large
        },
    },
});

export const ThemeProvider = ({ children }) => {
    return (
        <MaterialThemeProvider theme={theme}>
            {children}
        </MaterialThemeProvider>
    )
}