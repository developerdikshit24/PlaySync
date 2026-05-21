import { app } from "./app.js";
import dotenv from "dotenv"
import connectDB from './db/index.js';
import { createServer } from 'http';

import { initSocket } from "./utils/socket.js";

const httpServer = createServer(app);

initSocket(httpServer);

dotenv.config({
    path: "./env"
})

connectDB()
    .then(() => {
        httpServer.on("error", (error) => {
            console.log("Database Can't connect:", error);
        }
        )
        httpServer.listen(process.env.PORT || 8000, ()=>{console.log('And All Set...👍', process.env.PORT)})
}
)
    .catch((error) => {
    console.log("Mongo DB Connection Failed:" , error);
    
}
)