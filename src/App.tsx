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
import CreateProductPage from "./components/pages/CreateProductPage";
import EditProductPage from "./components/pages/EditProductPage";
import CreateVariantPage from "./components/pages/CreateVariantPage";
import useDynamicTitle from "./hooks/useDynamicTitle";
import OrderPage from "./components/pages/OrderPage";
import OrderDetailsPage from "./components/pages/OrderDetailPage";

function App() {
  useDynamicTitle();
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
        <Route
          path="/create"
          element={authUser ? <CreateProductPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/create/:id"
          element={authUser ? <CreateVariantPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/edit/:id"
          element={authUser ? <EditProductPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/orders"
          element={authUser ? <OrderPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/orders/:id"
          element={authUser ? <OrderDetailsPage /> : <Navigate to="/login" />}
        />
      </Route>
    </Routes>
  );
}

export default App;
