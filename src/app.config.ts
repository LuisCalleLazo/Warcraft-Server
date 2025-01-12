import config from "@colyseus/tools";
import { monitor } from "@colyseus/monitor";
import { playground } from "@colyseus/playground";

import { GameRoom } from "./rooms/GameRoom";

export default config({

    initializeGameServer: (gameServer) => {
        gameServer.define('game_room', GameRoom);
    },

    initializeExpress: (app) => {

        if (process.env.NODE_ENV !== "production") {
            app.use("/", playground);
        }

        app.use("/colyseus", monitor());
    },


    beforeListen: () => {
    }
});
