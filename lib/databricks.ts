import { DBSQLClient } from "@databricks/sql";

export async function runQuery(query: string) {
  const client = new DBSQLClient();

  const connection = await client.connect({
    host: process.env.DATABRICKS_HOST!,
    path: process.env.DATABRICKS_PATH!,
    token: process.env.DATABRICKS_TOKEN!,
  });

  const session = await connection.openSession();

  try {
    const operation = await session.executeStatement(query, {
      runAsync: true,
    });

    const result = await operation.fetchAll();
    await operation.close();

    return result;
  } finally {
    await session.close();
    await connection.close();
  }
}
