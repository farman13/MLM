import dotenv from "dotenv";
dotenv.config();
import app from "./app.js";
import connectDB from "./db/db.js";
import { startPoolListener } from "./listeners/pool.listener.js";

connectDB()
    .then(() => {
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
        // Start Pool Listener
        startPoolListener();
    })
    .catch((error) => {
        console.error("Failed to start server:", error);
    });