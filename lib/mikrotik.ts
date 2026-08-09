const host = process.env.MIKROTIK_HOST;
const port = Number(process.env.MIKROTIK_PORT ?? 8728);
const username = process.env.MIKROTIK_USER;
const password = process.env.MIKROTIK_PASSWORD;

export async function createHotspotUser(
  hotspotUsername: string,
  hotspotPassword: string,
  profile = "default",
  comment = "CloudiFi voucher"
) {
  if (!host || !username || !password) {
    throw new Error("Mikrotik credentials are not configured.");
  }

  const { RouterOSClient } = (await import("mikronode-ng")) as { RouterOSClient: any };
  const client = new RouterOSClient({
    host,
    port,
    username,
    password,
  });

  try {
    await client.connect();
    const connection = client.openChannel();
    const response = await connection.write([
      {
        command: "/ip/hotspot/user/add",
        args: [`=name=${hotspotUsername}`, `=password=${hotspotPassword}`, `=profile=${profile}`, `=comment=${comment}`],
      },
    ]);
    await connection.close();
    await client.close();
    return response;
  } finally {
    if (client?.isConnected && client.isConnected()) {
      await client.close();
    }
  }
}
