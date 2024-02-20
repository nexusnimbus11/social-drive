import express from 'express';

import authRoutes from './routes/authRoutes.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', authRoutes);

// fallback route
app.all('*', (req, res) => {
    return res.sendStatus(404);
});

export default app;
