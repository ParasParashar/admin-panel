import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AxiosBase from "@/lib/axios";
import { FaLeftLong, FaRightLong } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

// Fetch Orders Function
const fetchOrders = async ({ page, size }) => {
  const { data } = await AxiosBase.get("/api/admin/orders", {
    params: { page, size },
  });
  return data.data;
};

const OrderPage = () => {
  const navigate = useNavigate();
  const pageSize = 10; // Fixed page size for simplicity
  const [currentPage, setCurrentPage] = useState(1);

  // Updated query call following v5 API
  const {
    data: ordersData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["orders", currentPage],
    queryFn: () => fetchOrders({ page: currentPage, size: pageSize }),
  });

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  if (isLoading) {
    return (
      <main className="h-full">
        <h2 className="text-primary bg-secondary font-semibold text-xl mb-2 text-center py-1 rounded-sm">
          Loading Orders...
        </h2>
        {[...Array(4)].map((_, idx) => (
          <Skeleton key={idx} className="h-10 my-2 rounded-lg w-full" />
        ))}
      </main>
    );
  }

  if (isError) {
    return (
      <main className="h-full">
        <p className="text-center text-2xl font-bold">
          An error occurred while fetching orders.
        </p>
      </main>
    );
  }
  console.log(ordersData);

  return (
    <main className="h-full">
      <h2 className="text-primary bg-secondary font-semibold text-xl mb-2 text-center py-1 rounded-sm">
        All Orders
      </h2>

      {ordersData.orders?.length > 0 ? (
        <>
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="py-2 px-4">S.No</th>
                <th className="py-2 px-4">Customer Name</th>
                <th className="py-2 px-4">Total Amount</th>
                <th className="py-2 px-4">Payment Type</th>
                <th className="py-2 px-4">Payment Status</th>
                <th className="py-2 px-4">Delivery Status</th>
                <th className="py-2 px-4">Date</th>
                <th className="py-2 px-4">Order Items</th>
              </tr>
            </thead>
            <tbody>
              {ordersData?.orders.map((order, index) => (
                <tr
                  key={order.id}
                  className="cursor-pointer"
                  onClick={() => navigate(`/admin/orders/${order.id}`)}
                >
                  <td className="py-2 px-4">
                    {(currentPage - 1) * pageSize + index + 1}
                  </td>
                  <td className="py-2 px-4">{order.userId || "N/A"}</td>
                  <td className="py-2 px-4">₹{order.totalAmount}</td>
                  <td className="py-2 px-4">{order.paymentMethod}</td>
                  <td className="py-2 px-4">{order.status}</td>
                  <td className="py-2 px-4">{order.deliveryStatus}</td>
                  <td className="py-2 px-4">{formatDate(order.createdAt)}</td>
                  <td className="py-2 px-4">
                    {order.orderItems
                      ?.map((item) => item.product.name)
                      .join(", ")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-between items-center mt-4">
            <Button
              size="sm"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              <FaLeftLong />
              Previous
            </Button>
            <p>
              Page {currentPage} of {ordersData?.pagination?.totalPages}
            </p>
            <Button
              size="sm"
              disabled={currentPage === ordersData?.pagination?.totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Next
              <FaRightLong />
            </Button>
          </div>
        </>
      ) : (
        <p className="text-center text-2xl font-bold">
          Currently, there are no orders.
        </p>
      )}
    </main>
  );
};

export default OrderPage;
