interface Order {
  orderId: string;
  productName: string;
  customerName: string;
  orderDate: string;
  orderStatus: string;
  totalAmount: number;
}

interface DashboardProductProps {
  orderObj: Order;
}

const DashboardProduct = ({ orderObj }: DashboardProductProps) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md border border-gray-200">
      <div className="flex justify-between items-center">
        <h4 className="text-lg font-semibold text-gray-800">
          Order #{orderObj.orderId}
        </h4>
        <span
          className={`px-2 py-1 text-sm rounded-full ${
            orderObj.orderStatus === "Pending"
              ? "bg-yellow-200 text-yellow-800"
              : "bg-green-200 text-green-800"
          }`}
        >
          {orderObj.orderStatus}
        </span>
      </div>
      <p className="text-sm text-gray-600 mt-1">
        <strong>Customer:</strong> {orderObj.customerName}
      </p>
      <p className="text-sm text-gray-600 mt-1">
        <strong>Product:</strong> {orderObj.productName}
      </p>
      <p className="text-sm text-gray-600 mt-1">
        <strong>Date:</strong>{" "}
        {new Date(orderObj.orderDate).toLocaleDateString()}
      </p>
      <p className="text-sm text-gray-600 mt-1">
        <strong>Total:</strong> ${orderObj.totalAmount.toFixed(2)}
      </p>
    </div>
  );
};

export default DashboardProduct;
