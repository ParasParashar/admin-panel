import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import AxiosBase from "@/lib/axios";
import { Skeleton } from "@/components/ui/skeleton";
import DashboardDetailsCard from "../dashboard/DashboardDetalCard";
import DashboardProduct from "../dashboard/DashboardProduct";
import Chart from "../dashboard/Chart";
import PaymentTypePieChart from "../dashboard/PaymentTypePieChart";
import { Order } from "@/lib/type";

const DashboardPage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboardData"],
    queryFn: async () => {
      const { data } = await AxiosBase.get("/api/admin/dashboard");
      return data.data;
    },
  });

  const statistics = data || {};

  return (
    <>
      {isLoading ? (
        <Skeleton className="h-10 my-2 rounded-lg w-full bg-white" />
      ) : (
        <div className="flex flex-col gap-6 py-4">
          {/* Statistics Section */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              <DashboardDetailsCard
                title="Total Income"
                value={statistics?.totalIncome}
              />
              <DashboardDetailsCard
                title="Pending Orders"
                value={statistics?.recentPendingOrders?.length}
              />
              <DashboardDetailsCard
                title="All Products"
                value={statistics?.totalProducts}
              />
            </div>
          </div>

          {/* Chart and Details Section */}
          <section className="flex flex-col lg:flex-row gap-4">
            {/* Chart */}
            <div className="flex-1 w-full">
              <Chart productsArr={statistics?.productWiseIncome} />
            </div>

            {/* Payment Status and Latest Orders */}
            <div className="flex flex-col w-full lg:w-[40%] h-full gap-2">
              {/* Payment Status */}

              <div className="flex-1">
                <PaymentTypePieChart
                  paymentMethodStats={data.paymentMethodStats}
                />
              </div>

              {/* Latest Orders */}
              <div className="lg:h-2/3 my-2">
                <div className="flex items-center justify-between gap-4">
                  <h1 className="text-lg font-semibold ml-2">Latest Orders</h1>
                  <Link to="/admin/orders">
                    <Button variant="link">See All</Button>
                  </Link>
                </div>
                <div className="flex lg:flex-col gap-2 overflow-x-scroll md:overflow-auto">
                  {data.recentPendingOrders.length > 0 ? (
                    data.recentPendingOrders.map((order: Order) => (
                      <DashboardProduct key={order.id} orderObj={order} />
                    ))
                  ) : (
                    <p className="text-center text-lg font-bold py-4">
                      Currently, You don't have any pending order.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
    </>
  );
};

export default DashboardPage;
