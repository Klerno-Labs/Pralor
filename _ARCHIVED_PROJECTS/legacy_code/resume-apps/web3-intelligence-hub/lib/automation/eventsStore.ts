const events: any[] = []
export function addEvent(event: any) { events.unshift(event); if (events.length > 50) events.pop() }
export function getEvents() { return events }
