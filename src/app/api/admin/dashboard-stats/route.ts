import { NextRequest, NextResponse } from "next/server";
import pool from "@/db/db";

export async function GET(request: NextRequest) {
  try {
    const client = await pool.connect();

    try {
      // Ambil data penjualan tiket hari ini
      const todaySalesQuery = `
        SELECT COALESCE(COUNT(*)::int, 0) as total_sales
        FROM reservasi
        WHERE tanggal_kunjungan = CURRENT_DATE
      `;
      const todaySalesResult = await client.query(todaySalesQuery);
      const todayTicketSales = todaySalesResult.rows[0]?.total_sales || 0;

      // Ambil data penjualan tiket kemarin
      const yesterdaySalesQuery = `
        SELECT COALESCE(COUNT(*)::int, 0) as total_sales,
               COALESCE(SUM(jumlah_tiket * 50000)::int, 0) as revenue
        FROM reservasi
        WHERE tanggal_kunjungan = CURRENT_DATE - INTERVAL '1 day'
      `;
      const yesterdaySalesResult = await client.query(yesterdaySalesQuery);
      const yesterdayTicketSales =
        yesterdaySalesResult.rows[0]?.total_sales || 0;
      const yesterdayRevenue = yesterdaySalesResult.rows[0]?.revenue || 0;

      // Hitung persentase perubahan penjualan tiket
      let ticketSalesPercentage = 0;
      if (yesterdayTicketSales === 0 && todayTicketSales > 0) {
        // Jika kemarin 0 dan hari ini ada penjualan, berarti naik 100%
        ticketSalesPercentage = 100;
      } else if (yesterdayTicketSales === 0 && todayTicketSales === 0) {
        // Jika keduanya 0, tidak ada perubahan (0%)
        ticketSalesPercentage = 0;
      } else {
        // Perhitungan persentase normal
        ticketSalesPercentage = Math.round(
          ((todayTicketSales - yesterdayTicketSales) / yesterdayTicketSales) *
            100
        );
      }

      // Ambil data pengunjung hari ini
      const todayVisitorsQuery = `
        SELECT COALESCE(SUM(jumlah_tiket)::int, 0) as total_visitors
        FROM reservasi
        WHERE tanggal_kunjungan = CURRENT_DATE
      `;
      const todayVisitorsResult = await client.query(todayVisitorsQuery);
      const todayVisitors = todayVisitorsResult.rows[0]?.total_visitors || 0;

      // Ambil data pengunjung minggu lalu untuk hari yang sama
      const lastWeekVisitorsQuery = `
        SELECT COALESCE(SUM(jumlah_tiket)::int, 0) as total_visitors
        FROM reservasi
        WHERE tanggal_kunjungan = CURRENT_DATE - INTERVAL '1 week'
      `;
      const lastWeekVisitorsResult = await client.query(lastWeekVisitorsQuery);
      const lastWeekVisitors =
        lastWeekVisitorsResult.rows[0]?.total_visitors || 0;

      // Hitung persentase perubahan pengunjung
      let visitorsPercentage = 0;
      if (lastWeekVisitors === 0 && todayVisitors > 0) {
        visitorsPercentage = 100;
      } else if (lastWeekVisitors === 0 && todayVisitors === 0) {
        visitorsPercentage = 0;
      } else {
        visitorsPercentage = Math.round(
          ((todayVisitors - lastWeekVisitors) / lastWeekVisitors) * 100
        );
      }

      // Hitung pendapatan mingguan (tiket @ Rp 50.000)
      const weeklyRevenueQuery = `
        SELECT COALESCE(SUM(jumlah_tiket * 50000)::int, 0) as total_revenue
        FROM reservasi
        WHERE tanggal_kunjungan BETWEEN CURRENT_DATE - INTERVAL '6 days' AND CURRENT_DATE
      `;
      const weeklyRevenueResult = await client.query(weeklyRevenueQuery);
      const weeklyRevenue = weeklyRevenueResult.rows[0]?.total_revenue || 0;

      // Ambil pendapatan minggu sebelumnya
      const prevWeekRevenueQuery = `
        SELECT COALESCE(SUM(jumlah_tiket * 50000)::int, 0) as total_revenue
        FROM reservasi
        WHERE tanggal_kunjungan BETWEEN CURRENT_DATE - INTERVAL '13 days' AND CURRENT_DATE - INTERVAL '7 days'
      `;
      const prevWeekRevenueResult = await client.query(prevWeekRevenueQuery);
      const prevWeekRevenue = prevWeekRevenueResult.rows[0]?.total_revenue || 0;

      // Hitung persentase perubahan pendapatan
      let weeklyRevenuePercentage = 0;
      if (prevWeekRevenue === 0 && weeklyRevenue > 0) {
        weeklyRevenuePercentage = 100;
      } else if (prevWeekRevenue === 0 && weeklyRevenue === 0) {
        weeklyRevenuePercentage = 0;
      } else {
        weeklyRevenuePercentage = Math.round(
          ((weeklyRevenue - prevWeekRevenue) / prevWeekRevenue) * 100
        );
      }

      // Ambil data pendapatan harian selama seminggu terakhir
      const dailyRevenueQuery = `
        SELECT 
          to_char(tanggal_kunjungan, 'Dy') as day,
          COALESCE(SUM(jumlah_tiket * 50000)::int, 0) as daily_revenue
        FROM 
          reservasi
        WHERE 
          tanggal_kunjungan BETWEEN CURRENT_DATE - INTERVAL '6 days' AND CURRENT_DATE
        GROUP BY 
          tanggal_kunjungan
        ORDER BY 
          tanggal_kunjungan
      `;
      const dailyRevenueResult = await client.query(dailyRevenueQuery);

      // Format data untuk chart
      const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      const dayMapping: Record<string, string> = {
        Mon: "Mon",
        Tue: "Tue",
        Wed: "Wed",
        Thu: "Thu",
        Fri: "Fri",
        Sat: "Sat",
        Sun: "Sun",
      };

      const weeklyRevenueData = daysOfWeek.map((day) => {
        // Cari data untuk hari ini
        const matchingDay = dailyRevenueResult.rows.find(
          (row) => dayMapping[day] === row.day.trim()
        );

        return {
          name: day,
          value: matchingDay ? matchingDay.daily_revenue : 0,
        };
      });

      return NextResponse.json({
        todayTicketSales,
        yesterdayTicketSales,
        ticketSalesPercentage,
        todayVisitors,
        lastWeekVisitors,
        visitorsPercentage,
        weeklyRevenue,
        prevWeekRevenue,
        weeklyRevenuePercentage,
        weeklyRevenueData,
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error mengambil statistik dashboard admin:", error);
    return NextResponse.json(
      { error: "Gagal mengambil statistik dashboard" },
      { status: 500 }
    );
  }
}
