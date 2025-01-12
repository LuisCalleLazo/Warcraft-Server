import { Room, Client } from "@colyseus/core";
import { Schema, type, MapSchema, ArraySchema } from '@colyseus/schema'

class Player extends Schema {
  @type("string") id: string = "";
  @type("string") name: string = "";
  @type("boolean") isHost: boolean = false;
}

class GameEvent extends Schema {
  @type("string") eventType: string = ""; // e.g., "command", "score_update"
  @type("string") playerId: string = ""; // Who triggered the event
  @type("string") payload: string = "";  // Details of the event
}

class GameState extends Schema {
  @type({ map: Player }) players = new MapSchema<Player>();
  @type("string") status: string = "lobby"; // "lobby", "in-progress", "finished"
  @type([GameEvent]) events = new ArraySchema<GameEvent>();
}

export class GameRoom extends Room<GameState> {
  maxClients = 25;

  onCreate (options: any) {
    this.setState(new GameState());

    // Handle player commands
    this.onMessage("command", (client, message) => {
      const player = this.state.players.get(client.sessionId);
      if (!player) return;

      const event = new GameEvent();
      event.eventType = "command";
      event.playerId = client.sessionId;
      event.payload = JSON.stringify(message);

      this.state.events.push(event);
      this.broadcast("game_data", event);
    });

    // Handle game status updates
    this.onMessage("update_status", (client, message) => {
      const player = this.state.players.get(client.sessionId);
      if (player?.isHost) {
        this.state.status = message.status;
        this.broadcast("status_update", { status: this.state.status });
      }
    });
  }

  onJoin (client: Client, options: any) {
    const newPlayer = new Player();
    newPlayer.id = client.sessionId;
    newPlayer.name = options.name || `Player_${client.sessionId}`;
    newPlayer.isHost = this.state.players.size === 0;

    this.state.players.set(client.sessionId, newPlayer);

    this.broadcast("player_joined", {
      id: newPlayer.id,
      name: newPlayer.name,
      isHost: newPlayer.isHost,
    });

    console.log("Jugadore se a unido")
  }

  onLeave (client: Client, consented: boolean) {
    this.state.players.delete(client.sessionId);
    this.broadcast("player_left", { id: client.sessionId });
  }

  onDispose() {
    console.log("room: ", this.roomId, " disposing...");
  }

}
