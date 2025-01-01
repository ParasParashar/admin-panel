import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface PaymentTypePieChartProps {
  paymentMethodStats: {
    _count: { paymentMethod: number };
    paymentMethod: string;
  }[];
}

const PaymentTypePieChart = ({
  paymentMethodStats,
}: PaymentTypePieChartProps) => {
  // Map data from paymentMethodStats to the chart data format
  const data = paymentMethodStats.map((stat) => ({
    name: `${stat.paymentMethod} Orders`,
    value: stat._count.paymentMethod,
  }));

  // Define colors for the chart
  const COLORS = ["#FF8042", "#0088FE"];

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-lg font-semibold text-center mb-4">
        Order Types Distribution
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            label={({ name, value }) => `${name}: ${value}`}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PaymentTypePieChart;
