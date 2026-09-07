import Home from "@/pages/Home";
import { ThemeProvider } from "@/contexts/ThemeContext";
import ErrorBoundary from "./components/ErrorBoundary";

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <Home />
      </ThemeProvider>
    </ErrorBoundary>
  );
}
