import { useQuery } from "@tanstack/react-query";
import { Category } from "@/lib/type";
import AxiosBase from "@/lib/axios";

export const useCategories = () => {
  return useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await AxiosBase.get<{ categories: Category[] }>(
        "/api/admin/categories"
      );
      if (!data.categories) throw new Error("Failed to fetch categories");
      return data.categories;
    },
  });
};
