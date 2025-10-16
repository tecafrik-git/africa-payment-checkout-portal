import express, { Application, Request, Response, NextFunction } from 'express';
import paymentRoutes from './routes/payment.routes';
import { config } from './config';

/**
 * Initialize and configure Express application
 */
function createApp(): Application {
    const app = express();

    // Configure body parsers
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Register payment routes
    app.use(paymentRoutes);

    // Global error handling middleware
    app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
        console.error('Unhandled error:', err);
        res.status(500).send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Server Error</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #000;
                        color: #fff;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        margin: 0;
                    }
                    .error-container {
                        text-align: center;
                        padding: 2rem;
                        border: 2px solid #FFDB15;
                        border-radius: 8px;
                        max-width: 500px;
                    }
                    h1 {
                        color: #FFDB15;
                        margin-bottom: 1rem;
                    }
                </style>
            </head>
            <body>
                <div class="error-container">
                    <h1>Server Error</h1>
                    <p>An unexpected error occurred. Please try again later.</p>
                </div>
            </body>
            </html>
        `);
    });

    return app;
}

/**
 * Start the Express server
 */
export function startServer(): void {
    const app = createApp();
    const port = config.port;

    app.listen(port, () => {
        console.log(`Payment Portal Server started successfully`);
        console.log(`Server is running on port ${port}`);
        console.log(`Mode: ${config.paydunya.mode}`);
        console.log(`Currency: ${config.currency}`);
        console.log(`\nAccess the payment form at: http://localhost:${port}/payment?amount=1000&productName=Test+Product`);
    });
}

// Start server if this file is run directly
if (require.main === module) {
    startServer();
}
