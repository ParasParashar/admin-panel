import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import SellerPickupAddress from "../shared/SellerPicupAddress";
import AxiosBase from "@/lib/axios";

const CreateDelivery = () => {
  const { id } = useParams();

  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    pickupLocation: "",
    height: "",
    weight: "",
    breath: "",
    length: "",
  });

  const {
    mutate: updateDelivery,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: async () => {
      if (!formData) {
        throw new Error("Please fill all the data");
      }
      const response = await AxiosBase.post(
        `/api/admin/delivery/trigger-delivery/${id}`,
        {
          packetDimensions: {
            length: formData.length,
            breath: formData.breath,
            height: formData.height,
            weight: formData.weight,
          },
          pickupLocation: formData.pickupLocation,
        }
      );
      if (!response.data.success) throw new Error(response.data.message);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Delivery details updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["orderDetails", id] });
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateDelivery();
  };

  return (
    <section>
      <Dialog>
        <DialogTrigger>
          <Button variant={"delivery"}>Dispatch Order</Button>
        </DialogTrigger>
        <DialogContent className="p-5 max-w-5xl overflow-y-auto h-full custom-scrollbar">
          <DialogHeader className="p-0 mb-4">
            <DialogTitle className="text-lg font-semibold">
              Provide Packaging Details
            </DialogTitle>
            <DialogDescription>
              Fill in the required details for the package to calculate delivery
              cost and dispatch the order.
            </DialogDescription>
          </DialogHeader>
          <div className="">
            <h3 className="font-medium text-sm text-muted-foreground   ">
              Pickup Locations according to Ship Rocket:
            </h3>
            <SellerPickupAddress
              onSelectPickupLocation={(d) =>
                setFormData((prev) => ({ ...prev, pickupLocation: d }))
              }
            />
          </div>

          <form onSubmit={handleSubmit} className="">
            <h3 className="font-medium text-sm text-muted-foreground mb-2">
              Package Dimensions:
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Enter the dimensions of the package (in centimeters) and weight
              (in grams). Delivery cost is calculated based on the volumetric
              weight: <strong>(Length × Breadth × Height) ÷ 5000</strong> or the
              actual weight, whichever is higher.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label htmlFor="length" className="text-sm font-medium">
                  Length (cm)
                </label>
                <Input
                  id="length"
                  name="length"
                  autoFocus
                  placeholder="e.g., 50"
                  value={formData.length}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="breath" className="text-sm font-medium">
                  Breadth (cm)
                </label>
                <Input
                  id="breath"
                  name="breath"
                  placeholder="e.g., 30"
                  value={formData.breath}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="height" className="text-sm font-medium">
                  Height (cm)
                </label>
                <Input
                  id="height"
                  name="height"
                  placeholder="e.g., 20"
                  value={formData.height}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="weight" className="text-sm font-medium">
                  Weight (grams)
                </label>
                <Input
                  id="weight"
                  name="weight"
                  placeholder="e.g., 2000"
                  value={formData.weight}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <Button
              variant={"delivery"}
              type="submit"
              className="mt-6 w-full"
              disabled={isPending || !formData}
            >
              {isPending ? "Submitting..." : "Create Delivery"}
            </Button>
          </form>
          {isError && (
            <p className="text-sm text-destructive mt-2">{error.message}</p>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default CreateDelivery;
