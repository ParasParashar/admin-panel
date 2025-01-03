import { Seller } from "@/lib/type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { Input } from "../ui/input";
import toast from "react-hot-toast";
import AxiosBase from "@/lib/axios";
import { Button } from "../ui/button";

const SellerRegistrationForm = () => {
  const queryClient = useQueryClient();

  const { data: sellerDetails } = useQuery<Seller>({
    queryKey: ["authUser"],
  });
  const [formData, setFormData] = useState({
    name: sellerDetails?.name || "",
    email: sellerDetails?.email || "",
    shiprocketEmail: sellerDetails?.shiprocketEmail || "",
    shiprocketPassword: sellerDetails?.shiprocketPassword || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const { mutate: handleSubmit, isPending } = useMutation({
    mutationFn: async (e: React.FormEvent) => {
      try {
        e.preventDefault();
        const { data } = await AxiosBase.put(
          "/api/admin/seller/register",
          formData
        );
        if (!data.success) throw new Error(data.message);
        return data;
      } catch (error: any) {
        console.error(error.message);
        toast.error("Failed to create or update address");
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      toast.success(data.message || "Created successfully");
    },
  });

  return (
    <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
      <div className="text-center mb-6">
        <img
          src="/path/to/company-logo.png"
          alt="Company Logo"
          className="w-16 mx-auto mb-2"
        />
        <h1 className="text-2xl font-bold text-gray-700">Seller Admin Panel</h1>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        {/* Name */}
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Full Name
          </label>
          <Input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email Address
          </label>
          <Input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email address"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
            disabled
          />
        </div>

        {/* Shiprocket Email */}
        <div className="mb-4">
          <label
            htmlFor="shiprocketEmail"
            className="block text-sm font-medium text-gray-700"
          >
            Shiprocket Email
          </label>
          <Input
            type="email"
            id="shiprocketEmail"
            name="shiprocketEmail"
            value={formData.shiprocketEmail}
            onChange={handleChange}
            placeholder="Enter your Shiprocket email"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>

        {/* Shiprocket Password */}
        <div className="mb-4">
          <label
            htmlFor="shiprocketPassword"
            className="block text-sm font-medium text-gray-700"
          >
            Shiprocket Password
          </label>
          <Input
            type="password"
            id="shiprocketPassword"
            name="shiprocketPassword"
            value={formData.shiprocketPassword}
            onChange={handleChange}
            placeholder="Enter your Shiprocket password"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>

        <div>
          <Button
            disabled={
              isPending ||
              !formData.shiprocketPassword ||
              !formData.shiprocketEmail
            }
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            {sellerDetails ? "Update Details" : "Register as Seller"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SellerRegistrationForm;
