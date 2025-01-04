require('dotenv').config();
const express = require("express");

const app = express();
const port = process.env.PORT || 5000;

const authRoutes = require('./routes/auth');


app.use('/api/v1', authRoutes);

app.listen(port, (err) => {
    if (err) {
        console.error("Failed to start server:", err);
        process.exit(1);
    }
    console.log(`Server running on port ${port}`);
});