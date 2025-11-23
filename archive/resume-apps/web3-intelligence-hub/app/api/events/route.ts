import { getEvents } from "@/lib/automation/eventsStore";

export async function GET() {
    return Response.json({ events: getEvents() })
}
