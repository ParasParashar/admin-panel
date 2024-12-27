import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AxiosBase from "@/lib/axios";
import { FaLeftLong, FaRightLong } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { OrderItem } from "@/lib/type";

// Fetch Orders Function
const fetchOrders = async ({ page, size }: { page: number; size: number }) => {
  const { data } = await AxiosBase.get("/api/admin/orders", {
    params: { page, size },
  });
  return data.data;
};

const OrderPage = () => {
  const navigate = useNavigate();
  const pageSize = 10;
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

  const handlePageChange = (newPage: number) => {
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

  return (
    <main className="h-full">
      <h2 className="text-primary bg-secondary font-semibold text-xl mb-2 text-center py-1 rounded-sm">
        All Orders
      </h2>

      {ordersData.orders?.length > 0 ? (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>S.No</TableHead>
                <TableHead>Customer Name</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Payment Type</TableHead>
                <TableHead>Payment Status</TableHead>
                <TableHead>Delivery Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ordersData?.orders.map((order: OrderItem, index) => {
                return (
                  <TableRow
                    onClick={() => navigate(`/orders/${order.order.id}`)}
                    key={order.id}
                    className="cursor-pointer"
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="underline ">
                      {order.order.user?.name || "N/A"}
                    </TableCell>
                    <TableCell>&#8377;{order.order.totalAmount}</TableCell>
                    <TableCell>{order.order.paymentMethod}</TableCell>
                    <TableCell>{order.order.status}</TableCell>
                    <TableCell>{order.order.deliveryStatus}</TableCell>
                    <TableCell>{formatDate(order.order.createdAt)}</TableCell>
                    <TableCell className="underline text-blue-500 cursor-pointer">
                      more info
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

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
