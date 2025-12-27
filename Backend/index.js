const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require('./routes/authRoutes');
const parcelRoutes = require('./routes/PercelRoutes');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');


dotenv.config();
const app = express();

// middlewares
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/parcels', parcelRoutes);
// db connection
const DB = process.env.DB
mongoose.connect(DB).then(() => {
    console.log("DB connected")
}).catch((err) => {
    console.log("DB connection error", err)
})
// swagger configuration
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Courier API',
            version: '1.0.0',
        },
        servers: [{ url: `http://localhost:${process.env.PORT || 8000}/api` }],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
    },
    // Use an absolute path to avoid "No operations defined"
    apis: [`${path.join(__dirname, './routes/*.js')}`],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
console.log(swaggerDocs);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// server
const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
