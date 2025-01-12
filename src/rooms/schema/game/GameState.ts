import { Schema, type, MapSchema, ArraySchema } from "@colyseus/schema";
import { EventState } from "./EventState";
import { PlayerState } from "./PlayerState";

export class GameState extends Schema {
  @type({ map: PlayerState }) players = new MapSchema<PlayerState>();
  @type("string") status: string = "lobby"; // "lobby", "in-progress", "finished"
  @type([EventState]) events = new ArraySchema<EventState>();
}