import { Schema, type } from "@colyseus/schema";

export class EventState extends Schema {
  @type("string") eventType: string = ""; // e.g., "command", "score_update"
  @type("string") playerId: string = ""; // Who triggered the event
  @type("string") payload: string = "";  // Details of the event
}