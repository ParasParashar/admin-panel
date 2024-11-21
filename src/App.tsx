import { Navigate, Route, Routes } from "react-router-dom";
import LandingPage from "./components/pages/LandingPage";
import Layout from "./components/shared/Layout";
import DashboardPage from "./components/pages/DashboardPage";
import { useQuery } from "@tanstack/react-query";
import AxiosBase from "./lib/axios";
import PageLoader from "./components/loaders/PageLoader";
import { Seller } from "./lib/type";
import CategoryPage from "./components/pages/CategoryPage";
import ProductPage from "./components/pages/ProductPage";

function App() {
  const { data: authUser, isLoading } = useQuery<Seller>({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await AxiosBase("/auth/me");
        if (res.data.error) return null;
        return res.data;
      } catch (error: any) {
        throw new Error(error.message);
      }
    },
    retry: false,
  });
  if (isLoading) return <PageLoader />;

  return (
    <Routes>
      <Route
        path="/login"
        element={authUser ? <Navigate to={"/"} /> : <LandingPage />}
      />
      <Route
        path="/"
        element={!authUser ? <Navigate to={"/login"} /> : <Layout />}
      >
        <Route
          path="/"
          element={authUser ? <DashboardPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/category"
          element={authUser ? <CategoryPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/product"
          element={authUser ? <ProductPage /> : <Navigate to="/login" />}
        />
      </Route>
    </Routes>
  );
}

export default App;
