import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  FaUser,
  FaShippingFast,
  FaBox,
  FaClock,
  FaCheckCircle,
  FaTruck,
} from "react-icons/fa";
import { useParams } from "react-router-dom";
import AxiosBase from "@/lib/axios";
import { FaRupeeSign } from "react-icons/fa";

import { OrderDetailsSkeleton } from "../loaders/OrderSkeleton";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { SubOrder } from "@/lib/type";
import { useState } from "react";
import CreateDelivery from "../orders/CreateDelivery";
import ShiprocketDeliveries from "../orders/ShipRocketDeliveries";

const OrderDetailsPage = () => {
  const { id } = useParams();

  const { data: orderData, isLoading } = useQuery<SubOrder>({
    queryKey: ["orderDetails", id],
    queryFn: async () => {
      const { data } = await AxiosBase.get(`/api/admin/orders/${id}`);
      if (!data.success)
        throw new Error(data.message || "Failed to fetch order.");
      return data.data;
    },
  });

  if (isLoading) {
    return <OrderDetailsSkeleton />;
  }

  if (!orderData) {
    return <div className="text-center py-8">Order not found.</div>;
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING":
        return <FaClock className="text-yellow-500" />;
      case "PROCESSING":
        return <FaCheckCircle className="text-blue-500" />;
      case "OUT_OF_DELIVERY":
        return <FaTruck className="text-indigo-500" />;
      case "DELIVERED":
        return <FaCheckCircle className="text-green-500" />;
      default:
        return <FaClock className="text-gray-500" />;
    }
  };

  return (
    <main className=" p-3 lg:p-6 w-full h-full ">
      {/* <div className="  overflow-hidden"> */}
      <section className="p-6 bg-gradient-to-r rounded-lg from-[#3e2723] to-[#8a574e]">
        <h1 className="text-3xl space-y-2 font-bold text-white">
          Order Details
        </h1>
        {/* this is the order details data */}
        <p className="text-muted space-y-2">
          Order ID:
          <span className="text-blue-100 font-bold ml-2">#{orderData.id}</span>
        </p>
        {orderData.parentOrder.paymentMethod === "ONLINE" && (
          <div className=" space-y-1">
            <p className="text-muted">
              Razorpay Payment id:
              <span className="text-blue-100 font-bold ml-2">
                #{orderData.parentOrder.razorpayPaymentId}
              </span>
            </p>
            <p className="text-muted">
              Razorpay Order id:
              <span className="text-blue-100 font-bold ml-2">
                #{orderData.parentOrder.razorpayOrderId}
              </span>
            </p>
          </div>
        )}
      </section>

      <section className=" py-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Order Summary */}
          <div className="bg-secondary p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-800">
              <FaRupeeSign className="mr-2 text-[#f7b232]" /> Order Summary
            </h2>
            <div className="space-y-2">
              <p className="flex justify-between">
                <span className="text-gray-600">Total Amount:</span>
                <span className="font-semibold">
                  ₹ {orderData.totalAmount.toFixed(2)}
                </span>
              </p>
              <p className="flex justify-between">
                <span className="text-gray-600">Payment Method:</span>
                <span className="font-semibold">
                  {orderData.parentOrder.paymentMethod}
                </span>
              </p>
              <p className="flex justify-between">
                <span className="text-gray-600">Order Date:</span>
                <span className="font-semibold">
                  {new Date(
                    orderData.parentOrder.createdAt
                  ).toLocaleDateString()}
                </span>
              </p>
            </div>
          </div>

          {/* Customer Details */}
          <div className="bg-secondary p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-800">
              <FaUser className="mr-2 text-[#f7b232]" /> Customer Details
            </h2>
            <div className="space-y-2">
              <p className="flex justify-start gap-3">
                <span className="text-gray-600">Name:</span>
                <span className="font-semibold">
                  {orderData?.parentOrder.user?.name}
                </span>
              </p>
              <p className="flex justify-start gap-3">
                <span className="text-gray-600">Email:</span>
                <span className="font-semibold text-wrap   break-words break-all">
                  {orderData?.parentOrder.user?.email}
                </span>
              </p>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-secondary p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-800">
              <FaShippingFast className="mr-2 text-[#f7b232]" /> Shipping
              Address
            </h2>
            <div className="space-y-1">
              <p className="text-gray-800">
                {orderData.parentOrder.shippingAddress.street}
              </p>
              <p className="text-gray-800">
                {orderData.parentOrder.shippingAddress.city},{" "}
                {orderData.parentOrder.shippingAddress.state}{" "}
                {orderData.parentOrder.shippingAddress.postalCode}
              </p>
              <p className="text-gray-800">
                {orderData.parentOrder.shippingAddress.country}
              </p>
              <p className="text-gray-800 space-x-3 flex items-center">
                <span className="font-semibold">Phone:</span> +
                {orderData.parentOrder.shippingAddress.phoneNumber.slice(0, 2)}
                &nbsp;
                {orderData.parentOrder.shippingAddress.phoneNumber.slice(2)}
              </p>
            </div>
          </div>

          {/* Order Status */}
          <div className="bg-secondary p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-800">
              <FaClock className="mr-2 text-[#f7b232]" /> Order Status
            </h2>
            {orderData.Delivery.length !== 0 ? (
              <>
                <p className="text-sm text-muted-foreground">
                  Current Delivery Status:
                  <span className=" capitalize  ml-2 font-bold text-primary">
                    {orderData.deliveryStatus}
                  </span>
                </p>
                <p className="text-muted-foreground text-lg  font-semibold  break-all  break-words">
                  Ship product from the shiprocket or delete the delivery to
                  create a new delivery.
                </p>
              </>
            ) : (
              <div className="flex items-center justify-between space-x-4 mt-5">
                <span>{getStatusIcon(orderData.deliveryStatus)}</span>
                <CreateDelivery />
              </div>
            )}
          </div>
        </div>
        {/* shiprocket deliveries */}
        {orderData.Delivery.length > 0 && orderData.Delivery && (
          <ShiprocketDeliveries deliveries={orderData.Delivery} />
        )}

        {/* Order Items */}

        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 flex items-center">
            <FaBox className="mr-2 text-[#f7b232]" /> Order Items
          </h2>
          <div className="bg-secondary rounded-lg shadow-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Image</TableHead>
                  <TableHead>Current Stock</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Color</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orderData.orderItems.map((item, index) => (
                  <TableRow key={item.id + index}>
                    <TableCell>{item.product.name}</TableCell>
                    <TableCell>
                      <img
                        className="h-16 w-16 rounded object-fill"
                        src={item?.variant?.images[0]}
                        alt={item.product.name}
                      />
                    </TableCell>
                    <TableCell>{item.attribute?.stock}</TableCell>
                    <TableCell>{item.attribute?.size}</TableCell>
                    <TableCell className="">
                      {item.variant?.color}
                      <span
                        className=" h-3 w-3 rounded-full"
                        style={{ backgroundColor: item.variant?.color }}
                      ></span>
                    </TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>₹{item.price}</TableCell>
                    <TableCell>₹{item?.price * item.quantity}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </section>
    </main>
  );
};

export default OrderDetailsPage;
