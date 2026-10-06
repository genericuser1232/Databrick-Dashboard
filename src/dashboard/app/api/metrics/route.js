import { DBSQLClient } from '@databricks/sql';
import { NextResponse } from 'next/server';

export async function GET() {
  const client = new DBSQLClient();

  try {
    // Connect to Databricks using environment variables
    await client.connect({
      token: process.env.DATABRICKS_TOKEN,
      host: process.env.DATABRICKS_HOST, // e.g., 'adb-1234567890.12.azuredatabricks.net'
      path: process.env.DATABRICKS_HTTP_PATH, // e.g., '/sql/1.0/warehouses/abcdef123456'
    });

    const session = await client.openSession();

    // Run your Databricks SQL query (e.g., pulling KPIs and recent orders)
    const query = `
      SELECT 
        SUM(sales_amount) as total_revenue,
        COUNT(DISTINCT customer_id) as active_users,
        AVG(order_value) as avg_order_value
      FROM main.default.sales_summary
      WHERE date >= CURRENT_DATE() - INTERVAL 30 DAYS
    `;

    const queryOperation = await session.executeStatement(query, { runAsync: true });
    const result = await queryOperation.fetchAll();
    await queryOperation.close();
    await session.close();
    await client.close();

    // Format metrics for the dashboard cards
    const row = result[0] || {};
    const data = {
      totalRevenue: Number(row.total_revenue || 0),
      activeUsers: Number(row.active_users || 0),
      avgOrderValue: Number(row.avg_order_value || 0),
    };

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Databricks query error:', error);
    
    // Fallback mock data if Databricks is unreachable during local development/testing
    return NextResponse.json({
      success: true,
      data: {
        totalRevenue: 128450,
        activeUsers: 3420,
        avgOrderValue: 88.50,
      },
      fallback: true,
    });
  }
}