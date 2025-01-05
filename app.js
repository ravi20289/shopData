require('dotenv').config();
const express = require("express");
const sequelize = require('./database/connect');
const AppError = require('./utils/appError'); 
const globalErrorHandler = require('./middleware/errorHandler'); 
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send("Welcome to the Ravi Shop!");
});


app.use('/api/auth', require('./routes/authRoutes'));

app.all('*', (req, res, next) => {
    next(new AppError(`Cannot find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

sequelize.sync({ force: false }) 
    .then(() => {
        app.listen(port, (err) => {
            if (err) {
                console.error("Failed to start server:", err);
                process.exit(1);
            }
            console.log(`Server running on port ${port}`);
        });
    })
    .catch((error) => {
        console.error("Error syncing database:", error);
        process.exit(1);
    });
