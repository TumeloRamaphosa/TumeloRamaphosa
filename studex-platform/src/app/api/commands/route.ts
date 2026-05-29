import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import type { Command, EnqueueCommandResponse } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

interface Body {
  device_id?: string;
  action?: string;
  params?: Record<string, unknown>;
}

export async function POST(req: Request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    return NextResponse.json<EnqueueCommandResponse>(
      { ok: false, error: "Supabase not configured." },
      { status: 503 }
    );
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json<EnqueueCommandResponse>(
      { ok: false, error: "Invalid JSON." },
      { status: 400 }
    );
  }

  const { device_id, action, params = {} } = body;
  if (!device_id || !action) {
    return NextResponse.json<EnqueueCommandResponse>(
      { ok: false, error: "device_id and action are required." },
      { status: 400 }
    );
  }

  const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });

  // Resolve the hub_id from the device to keep the queue consistent.
  const deviceLookup = await supabase
    .from("devices")
    .select("id, hub_id")
    .eq("id", device_id)
    .maybeSingle();

  if (deviceLookup.error || !deviceLookup.data) {
    return NextResponse.json<EnqueueCommandResponse>(
      { ok: false, error: deviceLookup.error?.message ?? "Device not found." },
      { status: 404 }
    );
  }

  const insert = await supabase
    .from("commands")
    .insert({
      device_id,
      hub_id: deviceLookup.data.hub_id,
      action,
      params,
      status: "pending",
    })
    .select("*")
    .single();

  if (insert.error) {
    return NextResponse.json<EnqueueCommandResponse>(
      { ok: false, error: insert.error.message },
      { status: 500 }
    );
  }

  return NextResponse.json<EnqueueCommandResponse>({
    ok: true,
    command: insert.data as Command,
  });
}
