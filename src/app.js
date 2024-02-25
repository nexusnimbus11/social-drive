import express from 'express';

import authRoutes from './routes/authRoutes.js';

import globalErrorHandler from './middlewares/globalErrorHandler.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', authRoutes);

// fallback route
app.all('*', (req, res) => {
    return res.sendStatus(404);
});

// catches all errors and sends error response accordingly
app.use(globalErrorHandler);

export default app;
