import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

// Definisikan interface untuk props
interface AdminDashboardProps {
  userData: {
    id_staf?: string;
  };
}

// Ubah definisi komponen untuk menerima props
const AdminDashboard: React.FC<AdminDashboardProps> = ({ userData }) => {
  const [dashboardData, setDashboardData] = useState({
    todayTicketSales: 0,
    yesterdayTicketSales: 0,
    ticketSalesPercentage: 0,
    todayVisitors: 0,
    lastWeekVisitors: 0,
    visitorsPercentage: 0,
    weeklyRevenue: 0,
    prevWeekRevenue: 0,
    weeklyRevenuePercentage: 0,
    weeklyRevenueData: [] as Array<{ name: string; value: number }>
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('/api/admin/dashboard-stats');
        
        if (!response.ok) {
          throw new Error('Gagal mengambil data dashboard');
        }
        
        const data = await response.json();
        setDashboardData({
          todayTicketSales: data.todayTicketSales || 0,
          yesterdayTicketSales: data.yesterdayTicketSales || 0,
          ticketSalesPercentage: data.ticketSalesPercentage || 0,
          todayVisitors: data.todayVisitors || 0,
          lastWeekVisitors: data.lastWeekVisitors || 0,
          visitorsPercentage: data.visitorsPercentage || 0,
          weeklyRevenue: data.weeklyRevenue || 0,
          prevWeekRevenue: data.prevWeekRevenue || 0,
          weeklyRevenuePercentage: data.weeklyRevenuePercentage || 0,
          weeklyRevenueData: data.weeklyRevenueData || [
            { name: "Sen", value: 0 },
            { name: "Sel", value: 0 },
            { name: "Rab", value: 0 },
            { name: "Kam", value: 0 },
            { name: "Jum", value: 0 },
            { name: "Sab", value: 0 },
            { name: "Min", value: 0 },
          ]
        });
      } catch (err) {
        console.error("Error mengambil data dashboard:", err);
        setError("Gagal memuat statistik dashboard");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) return (
    <div className="flex justify-center items-center p-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
    </div>
  );

  if (error) return <div className="text-red-500 p-4">{error}</div>;

  // Format number to currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Format the percentage with correct sign
  const formatPercentage = (value: number) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value}%`;
  };

  return (
    <>
      <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>
      
      {/* Tampilkan Staff ID jika tersedia */}
      {userData.id_staf && (
        <Card className="border rounded-md mb-6 bg-white">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-700">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Staff ID</p>
                <p className="text-base font-medium">{userData.id_staf}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="border bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Today's Ticket Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {dashboardData.todayTicketSales}
            </div>
            <div className={`text-sm ${dashboardData.ticketSalesPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatPercentage(dashboardData.ticketSalesPercentage)} from yesterday
            </div>
            <div className="text-xs text-gray-500 mt-2">
              Previous Day: {dashboardData.yesterdayTicketSales} Tickets
            </div>
          </CardContent>
        </Card>

        <Card className="border bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Today's Visitors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {dashboardData.todayVisitors}
            </div>
            <div className={`text-sm ${dashboardData.visitorsPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatPercentage(dashboardData.visitorsPercentage)} from last week
            </div>
            <div className="text-xs text-gray-500 mt-2">
              Previous Week: {dashboardData.lastWeekVisitors} visitors
            </div>
          </CardContent>
        </Card>

        <Card className="border bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Weekly Ticket Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {formatCurrency(dashboardData.weeklyRevenue)}
            </div>
            <div className={`text-sm ${dashboardData.weeklyRevenuePercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatPercentage(dashboardData.weeklyRevenuePercentage)} from last week
            </div>
            <div className="text-xs text-gray-500 mt-2">
              Previous Week: {formatCurrency(dashboardData.prevWeekRevenue)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border bg-white">
        <CardHeader>
          <CardTitle>Weekly Ticket Revenue Summary</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dashboardData.weeklyRevenueData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                formatter={(value: any) => [`${formatCurrency(value)}`, 'Pendapatan']} 
                labelFormatter={(label) => `${label}`}
              />
              <Bar
                dataKey="value"
                fill="#2d6a4f"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </>
  );
};

export default AdminDashboard;