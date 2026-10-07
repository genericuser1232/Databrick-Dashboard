import { DBSQLClient } from "@databricks/sql";

type TokenResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
};

async function getAccessToken(): Promise<string> {
  const host = process.env.DATABRICKS_SERVER_HOSTNAME!;
  const clientId = process.env.DATABRICKS_CLIENT_ID!;
  const clientSecret = process.env.DATABRICKS_CLIENT_SECRET!;

  const tokenUrl = `https://${host}/oidc/v1/token`;

  const body = new URLSearchParams({
    grant_type: "client_credentials",
    scope: "all-apis",
  });

  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const resp = await fetch(tokenUrl, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`OAuth token fetch failed: ${resp.status} ${text}`);
  }

  const data = (await resp.json()) as TokenResponse;
  return data.access_token;
}

export async function runQuery(query: string) {
  const token = await getAccessToken();

  const client = new DBSQLClient();
  const connection = await client.connect({
    host: process.env.DATABRICKS_SERVER_HOSTNAME!,
    path: process.env.DATABRICKS_HTTP_PATH!,
    token,
  });

  const session = await connection.openSession();

  try {
    const operation = await session.executeStatement(query, { runAsync: false });
    const result = await operation.fetchAll();
    await operation.close();
    return result;
  } finally {
    await session.close();
    await connection.close();
  }
}
