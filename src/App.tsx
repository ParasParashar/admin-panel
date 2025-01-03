// import { Navigate, Route, Routes } from "react-router-dom";
// import LandingPage from "./components/pages/LandingPage";
// import Layout from "./components/shared/Layout";
// import DashboardPage from "./components/pages/DashboardPage";
// import { useQuery } from "@tanstack/react-query";
// import AxiosBase from "./lib/axios";
// import PageLoader from "./components/loaders/PageLoader";
// import { Seller } from "./lib/type";
// import CategoryPage from "./components/pages/CategoryPage";
// import ProductPage from "./components/pages/ProductPage";
// import CreateProductPage from "./components/pages/CreateProductPage";
// import EditProductPage from "./components/pages/EditProductPage";
// import CreateVariantPage from "./components/pages/CreateVariantPage";
// import useDynamicTitle from "./hooks/useDynamicTitle";
// import OrderPage from "./components/pages/OrderPage";
// import { lazy, Suspense } from "react";
// import { OrderDetailsSkeleton } from "./components/loaders/OrderSkeleton";

// function App() {
//   useDynamicTitle();
//   const OrderDetailsPage = lazy(
//     () => import("./components/pages/OrderDetailPage")
//   );
//   const { data: authUser, isLoading } = useQuery<Seller>({
//     queryKey: ["authUser"],
//     queryFn: async () => {
//       try {
//         const res = await AxiosBase("/api/admin/seller/me");
//         if (res.data.error) return null;
//         return res.data;
//       } catch (error: any) {
//         throw new Error(error.message);
//       }
//     },
//     retry: false,
//   });
//   if (isLoading) return <PageLoader />;

//   return (
//     <Routes>
//       <Route
//         path="/login"
//         element={authUser ? <Navigate to={"/"} /> : <LandingPage />}
//       />
//       <Route
//         path="/"
//         element={!authUser ? <Navigate to={"/login"} /> : <Layout />}
//       >
//         <Route
//           path="/"
//           element={authUser ? <DashboardPage /> : <Navigate to="/login" />}
//         />
//         <Route
//           path="/category"
//           element={authUser ? <CategoryPage /> : <Navigate to="/login" />}
//         />
//         <Route
//           path="/product"
//           element={authUser ? <ProductPage /> : <Navigate to="/login" />}
//         />
//         <Route
//           path="/create"
//           element={authUser ? <CreateProductPage /> : <Navigate to="/login" />}
//         />
//         <Route
//           path="/create/:id"
//           element={authUser ? <CreateVariantPage /> : <Navigate to="/login" />}
//         />
//         <Route
//           path="/edit/:id"
//           element={authUser ? <EditProductPage /> : <Navigate to="/login" />}
//         />
//         <Route
//           path="/orders"
//           element={authUser ? <OrderPage /> : <Navigate to="/login" />}
//         />
//         <Route
//           path="/orders/:id"
//           element={
//             authUser ? (
//               <Suspense fallback={<OrderDetailsSkeleton />}>
//                 <OrderDetailsPage />
//               </Suspense>
//             ) : (
//               <Navigate to="/login" />
//             )
//           }
//         />
//       </Route>
//     </Routes>
//   );
// }

// export default App;

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
import { lazy, Suspense } from "react";
import { OrderDetailsSkeleton } from "./components/loaders/OrderSkeleton";
import SellerRegistrationForm from "./components/shared/SellerRegistrationForm";
import SellerProfilePage from "./components/pages/SellerProfilePage";

function App() {
  useDynamicTitle();
  const OrderDetailsPage = lazy(
    () => import("./components/pages/OrderDetailPage")
  );

  // fetching seller data to determine authentication and Shiprocket details
  const { data: seller, isLoading } = useQuery<Seller>({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await AxiosBase("/api/admin/seller/me");
        if (res.data.error) return null;
        return res.data;
      } catch (error: any) {
        throw new Error(error.message);
      }
    },
    retry: false,
  });
  if (isLoading) return <PageLoader />;

  // if user is not logged in
  if (!seller) {
    return (
      <Routes>
        <Route path="/login" element={<LandingPage />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }

  // If Shiprocket details are missing, show the registration form
  if (!seller.shiprocketEmail || !seller.shiprocketPassword) {
    return (
      <div className="flex items-center justify-center h-screen bg-secondary">
        <SellerRegistrationForm />;
      </div>
    );
  }

  // Render authenticated routes if seller has Shiprocket details
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<DashboardPage />} />
        <Route path="category" element={<CategoryPage />} />
        <Route path="product" element={<ProductPage />} />
        <Route path="create" element={<CreateProductPage />} />
        <Route path="create/:id" element={<CreateVariantPage />} />
        <Route path="edit/:id" element={<EditProductPage />} />
        <Route path="orders" element={<OrderPage />} />
        <Route path="seller" element={<SellerProfilePage />} />
        <Route
          path="orders/:id"
          element={
            <Suspense fallback={<OrderDetailsSkeleton />}>
              <OrderDetailsPage />
            </Suspense>
          }
        />
      </Route>
      <Route path="/login" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
