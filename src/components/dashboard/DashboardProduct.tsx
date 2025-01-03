import { Order } from "@/lib/type";
import { formatDate } from "@/lib/utils";
import { Link } from "react-router-dom";

interface DashboardProductProps {
  orderObj: Order;
}

const DashboardProduct = ({ orderObj }: DashboardProductProps) => {
  return (
    <Link
      to={`/orders/${orderObj.id}`}
      className="p-4 bg-white rounded-lg shadow-md border border-gray-200"
    >
      <div className="flex justify-between items-center">
        <h4 className="text-lg font-semibold text-gray-800">
          Order #{orderObj.id}
        </h4>
        <span
          className={`px-2 py-1 text-sm rounded-full ${
            orderObj.deliveryStatus === "PENDING"
              ? "bg-yellow-200 text-yellow-800"
              : "bg-green-200 text-green-800"
          }`}
        >
          {orderObj.deliveryStatus}
        </span>
      </div>
      <p className="text-sm text-gray-600 mt-1">
        <strong>Total order amount:</strong>
        <span className=" font-bold  text-[16px]">
          &#8377;{orderObj.totalAmount}
        </span>
      </p>
      <p className="text-sm text-gray-600 mt-1">
        <strong>Product:</strong> {orderObj.orderItems[0].product.name}
      </p>
      <p className="text-sm text-gray-600 mt-1">
        <strong>Date:</strong> {formatDate(orderObj.createdAt)}
      </p>
      <p className="text-sm text-gray-600 mt-1">
        <strong>Total:</strong> ${orderObj.totalAmount.toFixed(2)}
      </p>
    </Link>
  );
};

export default DashboardProduct;
