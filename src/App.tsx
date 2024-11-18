import { Route, Routes } from "react-router-dom";
import LandingPage from "./components/pages/LandingPage";
import Layout from "./components/shared/Layout";
import DashboardPage from "./components/pages/DashboardPage";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LandingPage />} />
      <Route path="/" element={<Layout />}>
        <Route path="/" element={<DashboardPage />} />
      </Route>
    </Routes>
  );
}

export default App;
