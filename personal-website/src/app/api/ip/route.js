export async function GET(req) {
  const ip =
    req.headers.get("x-real-ip") ||
    req.headers.get("x-forwarded-for") ||
    req.socket.remoteAddress;
  const agent = req.headers.get("user-agent");
  let os = "Unknown";
  if (/Macintosh|mac os x/i.test(agent)) {
    os = "MacOS";
  } else if (/Windows/i.test(agent)) {
    os = "Windows";
  } else if (/Linux/i.test(agent)) {
    os = "Linux";
  } else if (/Android/i.test(agent)) {
    os = "Android";
  } else if (/iOS/i.test(agent)) {
    os = "iOS";
  }

  //  console.log("User-Agent: "+ agent);
  return new Response(
    JSON.stringify({
      ip: Array.isArray(ip) ? ip[0] : ip || "ip is unavailable",
      os: os,
    }),
    {
      headers: {
        "content-type": "application/json",
      },
    }
  );
}
