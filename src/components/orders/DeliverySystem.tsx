import { Select, SelectItem } from "@radix-ui/react-select";
import { useState } from "react";
import {
  SelectContent,
  SelectGroup,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import CreateDelivery from "./CreateDelivery";
import AxiosBase from "@/lib/axios";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { Loader } from "lucide-react";

type props = {
  deliveryStatus: string;
  paymentMethod: string;
};
const DeliverySystem = ({ deliveryStatus, paymentMethod }: props) => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [deilveryType, setDelivertType] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    try {
      setIsLoading(true);
      const { data } = await AxiosBase.put(`/api/admin/order/update/${id}`, {
        status: newStatus,
        paymentMethod: paymentMethod,
      });
      if (!data.success)
        throw new Error(data.message || "Failed to update status.");

      toast.success("Status updated successfully");
      queryClient.invalidateQueries({ queryKey: ["orderDetails", id] });
    } catch (error: any) {
      console.error(error.message);
      toast.error("Failed to update delivery status");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center  gap-5">
      <Select onValueChange={(value) => setDelivertType(value)}>
        <span className=" capitalize text-sm">{deilveryType}</span>
        <SelectTrigger>
          <SelectValue placeholder="Select Delivery System" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="own">By Own your own</SelectItem>
            <SelectItem value="shiprocket">By Shiprocket</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      {deilveryType === "shiprocket" && <CreateDelivery />}
      {deilveryType === "own" && (
        <div className="flex items-center gap-2">
          {isLoading && <Loader className="animate-spin" />}
          <Select
            disabled={isLoading}
            onValueChange={(value) => handleStatusChange(value)}
          >
            <SelectTrigger className="w-full ">
              <SelectValue placeholder="Update delivery status" />
            </SelectTrigger>
            <SelectContent className="bg-secondary">
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="SHIPPED">Shipped</SelectItem>
              <SelectItem value="OUT_FOR_DELIVERY">Out of delivery</SelectItem>
              <SelectItem value="DELIVERED">Delivered</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
};
export default DeliverySystem;
