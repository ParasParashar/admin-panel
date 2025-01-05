import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import AxiosBase from "@/lib/axios";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ScrollArea } from "../ui/scroll-area";
import { cn } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";

type Props = {
  onSelectPickupLocation?: (name: string) => void;
};

const SellerPickupAddress = ({ onSelectPickupLocation }: Props) => {
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["sellerPickupAddress"],
    queryFn: async () => {
      const { data } = await AxiosBase.get(`/api/admin/delivery/addresses`);
      if (!data.success)
        throw new Error(data.message || "Failed to fetch pickup address.");
      return data.data;
    },
  });

  const handleCardClick = (pickupLocation: string) => {
    if (onSelectPickupLocation) {
      setSelectedLocation(pickupLocation);
      onSelectPickupLocation(pickupLocation);
    }
  };

  if (isLoading) {
    return (
      <ScrollArea className="h-[400px]  w-full space-y-3">
        <p className="text-sm text-muted-foreground font-bold mb-3">
          Loading Pickup Locations...
        </p>
        <section className="flex flex-col gap-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <Card
              key={index}
              className="rounded-md w-full p-3 px-5 border border-gray-300"
            >
              <CardHeader className="p-0">
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-3 w-3/4" />
              </CardHeader>
              <CardContent className="p-0 mt-3 space-y-2">
                <Skeleton className="h-3 w-2/3" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-3 w-1/3" />
              </CardContent>
            </Card>
          ))}
        </section>
      </ScrollArea>
    );
  }
  if (error)
    return <p className="text-destructive text-sm">Error: {error.message}</p>;

  return (
    <ScrollArea className="h-[350px] w-full space-y-3">
      <section className="flex flex-col gap-2">
        {data.map((address: any, index: number) => (
          <Card
            onClick={() => handleCardClick(address.pickup_location)}
            key={index}
            className={cn(
              "cursor-pointer rounded-md text-sm w-full p-3 px-5  transition-all",
              selectedLocation === address.pickup_location
                ? "border-2 border-[#5b5150bb] shadow-lg"
                : "border-2 border-gray-300"
            )}
          >
            <CardHeader className="p-0">
              <CardTitle className="flex items-center">
                <span className="text-primary font-medium text-sm mr-2">
                  {index + 1}.
                </span>
                {address.pickup_location}
              </CardTitle>
              <CardDescription className="text-muted-foreground text-xs">
                {address.address}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1">
                <p>
                  <strong className="font-medium">Name:</strong> {address.name}
                </p>
                <p>
                  <strong className="font-medium">Contact:</strong>{" "}
                  <span>
                    {address.phone} / {address.email}
                  </span>
                </p>
                <p>
                  <strong className="font-medium">Pin Code:</strong>{" "}
                  {address.pin_code}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>
    </ScrollArea>
  );
};

export default SellerPickupAddress;
