import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { MotionConfig } from "framer-motion";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import { Route, Switch } from "wouter";

export default function App() {
  return (
    <ErrorBoundary>
      <MotionConfig reducedMotion="user">
        <ThemeProvider defaultTheme="light">
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/404" component={NotFound} />
            <Route component={NotFound} />
          </Switch>
        </ThemeProvider>
      </MotionConfig>
    </ErrorBoundary>
  );
}
