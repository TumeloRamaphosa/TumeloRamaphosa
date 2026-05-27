import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import type { Device, Hub, DevicesResponse } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

function emptyResponse(extra: Partial<DevicesResponse> = {}): DevicesResponse {
  return {
    configured: false,
    hubs: [],
    devices: [],
    counts: { total: 0, online: 0, wifi: 0, usb: 0, ble: 0, ha: 0 },
    ...extra,
  };
}

// Reads the device inventory server-side using the service role key. The key
// never reaches the browser, and RLS stays strict (no anon/public policies).
export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    return NextResponse.json(
      emptyResponse({ error: "Supabase not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY." })
    );
  }

  const supabase = createClient(url, serviceKey, {
    auth: { persistSession: false },
  });

  const [devicesRes, hubsRes] = await Promise.all([
    supabase.from("devices").select("*").order("last_seen", { ascending: false }),
    supabase.from("hubs").select("*").order("last_seen", { ascending: false }),
  ]);

  if (devicesRes.error || hubsRes.error) {
    return NextResponse.json(
      emptyResponse({
        configured: true,
        error: devicesRes.error?.message ?? hubsRes.error?.message,
      })
    );
  }

  const devices = (devicesRes.data ?? []) as Device[];
  const hubs = (hubsRes.data ?? []) as Hub[];

  const counts = {
    total: devices.length,
    online: devices.filter((d) => d.online).length,
    wifi: devices.filter((d) => d.source === "wifi").length,
    usb: devices.filter((d) => d.source === "usb").length,
    ble: devices.filter((d) => d.source === "ble").length,
    ha: devices.filter((d) => d.source === "ha").length,
  };

  const body: DevicesResponse = { configured: true, hubs, devices, counts };
  return NextResponse.json(body);
}
