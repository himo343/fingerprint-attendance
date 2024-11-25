import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#001F3F", // الأزرق الداكن
    },
    secondary: {
      main: "#3A6D8C", // الأزرق المتوسط
    },
    error: {
      main: "#FF1744", // الأحمر
    },
    background: {
      default: "#F5F5F5", // خلفية فاتحة
    },
  },
  typography: {
    fontFamily: "'Cairo', sans-serif", // استخدم خطًا عربيًا مناسبًا
    h1: {
      fontSize: "2.5rem",
      fontWeight: 700,
    },
    h4: {
      fontSize: "1.5rem",
      fontWeight: 500,
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.5,
    },
  },
});

export default theme;
