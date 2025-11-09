import dotenv from "dotenv"
dotenv.config();

import express, { NextFunction, Request } from 'express';
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import compression from 'compression'
import morgan from 'morgan'
import router from './routes/click-safe.routes.js';





const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: {
        error: 'Too many requests from this IP, please try again later.'
    }
});
app.use(limiter);

app.use(compression());
app.use(morgan('combined'));
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));


app.get("/", (req, res) => {
    res.send("<h2> hello world</h2>")
})
// Routes
app.use('/api/v1', router);

// Health check endpoint
app.get('/api/v1/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        version: '1.0.0'
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        error: `Route ${req.originalUrl} not found`
    });
});


app.use((err: any, req: Request, res: any, next: NextFunction) => {
    console.error('Global error handler:', err);

    res.status(500).json({
        success: false,
        error: process.env.NODE_ENV === 'production'
            ? 'Internal server error'
            : err.message
    });
});

// Start server
// Change this:
app.listen(PORT, () => {
    console.log(` Click-Safe Backend running on port ${PORT}`);
});

// To this:
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(` Click-Safe Backend running on port ${PORT}`);
    });
}

export default app;
