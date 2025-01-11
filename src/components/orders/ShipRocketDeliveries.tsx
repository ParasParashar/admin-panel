import AxiosBase from "@/lib/axios";
import { Delivery } from "@/lib/type";
import { formatDate } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Link, useParams } from "react-router-dom";
import ConfirmModel from "../shared/ConfirmModel";
import { Button } from "../ui/button";
import { TbTrash } from "react-icons/tb";
import { Loader } from "lucide-react";

const ShiprocketDeliveries = ({ deliveries }: { deliveries?: Delivery[] }) => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  // Mutation for deleting a product
  const { mutate: deleteProduct, isPending: deletePending } = useMutation({
    mutationFn: async (id: string) => {
      const { data } = await AxiosBase.delete(
        `/api/admin/delivery/delete/${id}`
      );
      if (!data.success) throw new Error(data.message);
      console.log(data);
    },
    onSuccess: () => {
      toast.success("Delivery deleted permanently!");
      queryClient.invalidateQueries({ queryKey: ["orderDetails", id] });
    },
    onError: () => {
      toast.error("Failed to delete order delivery");
    },
  });

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    e.preventDefault();
    deleteProduct(id);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Ship order Deliveries</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {deliveries?.map((delivery) => (
          <div
            key={delivery.id}
            className="border relative border-gray-300 rounded-lg shadow-md p-4 bg-white"
          >
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Shipment ID: {delivery.shipmentId}
            </h2>
            <ConfirmModel
              message="By doing this your delivery is also cancel from your deivery provider,And this action cannot be reversed."
              onConfirm={(e) => handleDelete(e, delivery.id)}
            >
              <Button
                size={"icon"}
                className="rounded-full text-red-400 absolute top-2 right-2"
                variant={"outline"}
              >
                {deletePending ? (
                  <Loader className="animate-spin" />
                ) : (
                  <TbTrash size={10} />
                )}
              </Button>
            </ConfirmModel>
            <p>
              <span className="font-semibold">Delivery Service:</span>{" "}
              {delivery.deliveryService}
            </p>
            <p>
              <span className="font-semibold">Channel Order ID:</span>{" "}
              {delivery.channelOrderId}
            </p>
            <p>
              <span className="font-semibold">Delivery Status:</span>{" "}
              <span
                className={`${
                  delivery.deliveryStatus === "CANCELED"
                    ? "text-red-600"
                    : "text-green-600"
                } font-bold`}
              >
                {delivery.deliveryStatus}
              </span>
            </p>
            <p>
              <span className="font-semibold">Created At:</span>{" "}
              {formatDate(delivery.createdAt)}
            </p>
            {delivery.deliveryStatus !== "DELIVERED" && (
              <Link
                to={`https://app.shiprocket.in/seller/orders/details/${delivery.ship_order_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block   text-white font-bold py-2 px-4 bg-blue-500 rounded hover:bg-blue-300"
              >
                Ship Order
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShiprocketDeliveries;
