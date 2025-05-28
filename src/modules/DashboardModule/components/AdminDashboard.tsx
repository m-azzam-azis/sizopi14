import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

interface AdminDashboardProps {
  userData: {
    staffId?: string;
    todayTicketSales?: number;
    todayTicketSalesPercentage?: number;
    todayVisitors?: number;
    todayVisitorsPercentage?: number;
    weeklyRevenue?: number;
    weeklyRevenuePercentage?: number;
    weeklyRevenueData?: Array<{ name: string; value: number }>;
  };
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ userData }) => {
  // Data default jika tidak ada
  const weeklyData = userData.weeklyRevenueData || [
    { name: "Mon", value: 2500 },
    { name: "Tue", value: 1500 },
    { name: "Wed", value: 10000 },
    { name: "Thu", value: 4000 },
    { name: "Fri", value: 5000 },
    { name: "Sat", value: 7500 },
    { name: "Sun", value: 4500 },
  ];

  return (
    <>
      <h2 className="text-2xl font-bold mb-4 text-[#1e381e]">Admin Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="border rounded-md shadow-sm bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Today&apos;s Ticket Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {userData.todayTicketSales || 0}
            </div>
            <div className="text-sm text-green-600">
              +{userData.todayTicketSalesPercentage || 20}% from yesterday
            </div>
          </CardContent>
        </Card>

        <Card className="border rounded-md shadow-sm bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Today&apos;s Visitors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {userData.todayVisitors || 0}
            </div>
            <div className="text-sm text-green-600">
              +{userData.todayVisitorsPercentage || 10}% from last week
            </div>
          </CardContent>
        </Card>

        <Card className="border rounded-md shadow-sm bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Weekly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              Rp {userData.weeklyRevenue || 0}
            </div>
            <div className="text-sm text-green-600">
              +{userData.weeklyRevenuePercentage || 12}% from last week
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="col-span-3 border rounded-md shadow-sm bg-white">
        <CardHeader>
          <CardTitle>Weekly Revenue Overview</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                formatter={(value) => [`Rp ${value}`, 'Revenue']} 
                labelFormatter={(label) => `${label}`}
              />
              <Bar
                dataKey="value"
                fill="#006400" // Dark green color as in the screenshot
                radius={[0, 0, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </>
  );
};

export default AdminDashboard;