const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require('./routes/authRoutes');
const parcelRoutes = require('./routes/PercelRoutes');
const userRoutes = require('./routes/userRoutes');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');
const http = require('http');
const { Server } = require("socket.io");
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// socket io
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("join_parcel", ({ parcelId }) => {
        socket.join(`parcel:${parcelId}`);
    });

    socket.on("agent_location", ({ parcelId, lat, lng }) => {
        io.to(`parcel:${parcelId}`).emit("location_update", {
            parcelId,
            lat,
            lng,
            updatedAt: new Date().toISOString(),
        });
    });

    socket.on("disconnect", () => {
        console.log("Socket disconnected:", socket.id);
    });
});


// middlewares

app.use('/api/auth', authRoutes);
app.use('/api/parcels', parcelRoutes);
app.use('/api/users', userRoutes);

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
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
