import {
  XAxis,
  CartesianGrid,
  YAxis,
  Tooltip,
  Bar,
  BarChart,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Chart = ({ productsArr }: any) => {
  // Transform incoming data for chart usage
  const chartData = productsArr?.map((product) => ({
    productName: product.productName,
    totalSale: product._sum.price,
  }));

  return (
    <Card className="w-full lg:w-full ">
      <CardHeader>
        <CardTitle>Product Sales Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ left: 2, right: 2 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="productName"
              tickLine={false}
              axisLine={false}
              tickMargin={6}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis />
            <Tooltip />
            <Bar
              dataKey="totalSale"
              name="Total sale"
              fill="#89a4f4"
              label={{ position: "top", fill: "#000" }}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 leading-none text-black text-base">
              Most checkout products over the period
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default Chart;
