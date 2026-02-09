import dotenv from "dotenv";
dotenv.config();
import app from "./app.js";
import connectDB from "./db/db.js";

connectDB()
    .then(() => {
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("Failed to start server:", error);
    });