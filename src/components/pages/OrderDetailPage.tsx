import React, { useEffect, useState } from "react";
import {
  FaUser,
  FaShippingFast,
  FaBox,
  FaClock,
  FaCheckCircle,
  FaTruck,
  FaBan,
} from "react-icons/fa";
import { useParams } from "react-router-dom";
import AxiosBase from "@/lib/axios";
import { FaRupeeSign } from "react-icons/fa";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import toast from "react-hot-toast";
import { OrderDetailsSkeleton } from "../loaders/OrderSkeleton";

// TODO: update soone for the order details badge of payment status
const StatusBadge = ({ status }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "PROCESSING":
        return "bg-blue-100 text-blue-800";
      case "SHIPPED":
        return "bg-indigo-100 text-indigo-800";
      case "DELIVERED":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <span
      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
        status
      )}`}
    >
      {status}
    </span>
  );
};

const OrderDetailsPage = () => {
  const { id } = useParams();
  const [orderData, setOrderData] = useState(null);
  const [orderStatus, setOrderStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const { data } = await AxiosBase.get(`/api/admin/orders/${id}`);
      if (!data.success) throw new Error();

      setOrderData(data.data);
      setOrderStatus(data.data.status);
    } catch (error) {
      console.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      setIsLoading(true);
      const { data } = await AxiosBase.put(`/api/admin/order/update/${id}`, {
        status: newStatus,
        paymentMethod: orderData.paymentMethod,
      });
      if (!data.success)
        throw new Error(data.message || "Failed to update status.");

      toast.success("Status updated successfully");
      fetchOrders();
    } catch (error) {
      console.error(error.message);
      toast.error("Failed to update delivery status");
    } finally {
      setIsLoading(false);
    }
  };

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

  useEffect(() => {
    fetchOrders();
  }, [id]);

  if (isLoading) {
    return <OrderDetailsSkeleton />;
  }

  if (!orderData) {
    return <div className="text-center py-8">Order not found.</div>;
  }

  return (
    <div className=" p-6 ">
      {/* <div className="  overflow-hidden"> */}
      <section className="p-6 bg-gradient-to-r rounded-lg from-[#3e2723] to-[#8a574e]">
        <h1 className="text-3xl space-y-2 font-bold text-white">
          Order Details
        </h1>
        <p className="text-muted space-y-2">
          Order ID:
          <span className="text-blue-100 font-bold ml-2">#{orderData.id}</span>
        </p>
        {orderData.paymentMethod === "ONLINE" && (
          <div className=" space-y-1">
            <p className="text-muted">
              Razorpay Payment id:
              <span className="text-blue-100 font-bold ml-2">
                #{orderData.razorpayPaymentId}
              </span>
            </p>
            <p className="text-muted">
              Razorpay Order id:
              <span className="text-blue-100 font-bold ml-2">
                #{orderData.razorpayOrderId}
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
                <span className="font-semibold">{orderData.paymentMethod}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-gray-600">Order Date:</span>
                <span className="font-semibold">
                  {new Date(orderData.createdAt).toLocaleDateString()}
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
                <span className="font-semibold">{orderData?.user?.name}</span>
              </p>
              <p className="flex justify-start gap-3">
                <span className="text-gray-600">Email:</span>
                <span className="font-semibold">
                  {orderData?.shippingAddress?.email}
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
                {orderData.shippingAddress.street}
              </p>
              <p className="text-gray-800">
                {orderData.shippingAddress.city},{" "}
                {orderData.shippingAddress.state}{" "}
                {orderData.shippingAddress.postalCode}
              </p>
              <p className="text-gray-800">
                {orderData.shippingAddress.country}
              </p>
              <p className="text-gray-800">
                <span className="font-semibold">Phone:</span>{" "}
                {orderData.shippingAddress.phonenumber}
              </p>
            </div>
          </div>

          {/* Order Status */}
          <div className="bg-secondary p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-800">
              <FaClock className="mr-2 text-[#f7b232]" /> Order Status
            </h2>
            <p className="text-sm text-muted-foreground">
              Current Delivery Status:
              <span className=" capitalize  ml-2 font-bold text-primary">
                {orderData.deliveryStatus}
              </span>
            </p>
            <p className="text-sm text-muted-foreground mt-5">Update status</p>
            <div className="flex items-center justify-between space-x-4">
              <span>{getStatusIcon(orderStatus)}</span>
              <Select
                value={orderData.deliveryStatus}
                onValueChange={(value) => handleStatusChange(value)}
                className="form-select block w-full mt-1  rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 "
              >
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="update delivery status" />
                </SelectTrigger>
                <SelectContent className="bg-secondary">
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="SHIPPED">Shipped</SelectItem>
                  <SelectItem value="OUT_FOR_DELIVERY">
                    Out of delivery
                  </SelectItem>
                  <SelectItem value="DELIVERED">Delivered</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 flex items-center">
            <FaBox className="mr-2 text-[#f7b232]" /> Order Items
          </h2>
          <div className="bg-secondary rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-zinc-100">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Product
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Quantity
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Price
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-secondary divide-y divide-gray-200">
                {orderData.orderItems.map((item, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={item.product.imageUrl}
                            alt={item.product.name}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {item.product.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {item.quantity}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {" "}
                        ₹{item.price.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        ₹{(item.quantity * item.price).toFixed(2)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
      {/* </div> */}
    </div>
  );
};

export default OrderDetailsPage;
