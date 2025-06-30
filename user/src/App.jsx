import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import LoginForm from "./Login";
import RegistrationForm from "./Register";
import Welcome from "./Wlcome";
import Otpver from "./otpverify";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/login"
          element={
            <motion.div
              initial={{ x: "-100vw", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100vw", opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <LoginForm />
            </motion.div>
          }
        />
        <Route
          path="/"
          element={
            <motion.div
              initial={{ x: "100vw", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100vw", opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <RegistrationForm />
            </motion.div>
          }
        />
        <Route path="/welcome" element={<Welcome/>}/>
        <Route path="/otpverify" element={<Otpver/>}/>
        </Routes>
    </AnimatePresence>
  );
}
export default function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
      
    </BrowserRouter>
  );
}
