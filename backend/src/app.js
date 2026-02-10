import express from 'express';
import cors from 'cors';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import poolRouter from './routes/pool.route.js';


const app = express();

app.use((err, req, res, next) => {
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Something went wrong",
        errors: err.errors || [],
    });
});


app.use(express.json());
app.use(cors());
app.use('/api/v1/users', userRouter);
app.use('/api/v1/auth', authRouter);
app.use("/api/v1/pool", poolRouter);

export default app;