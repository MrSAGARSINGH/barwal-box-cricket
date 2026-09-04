import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';

import connectDB from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

/* =========================
   SECURITY
========================= */

app.use(helmet());

/* =========================
   CORS
========================= */

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:5176',
  'https://barwal-box-cricket.vercel.app',
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow Postman, curl and server-to-server requests
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.log(`CORS blocked origin: ${origin}`);

    return callback(
      new Error('Not allowed by CORS')
    );
  },

  credentials: true,

  methods: [
    'GET',
    'POST',
    'PUT',
    'PATCH',
    'DELETE',
    'OPTIONS',
  ],

  allowedHeaders: [
    'Content-Type',
    'Authorization',
  ],

  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

/*
  Explicitly handle browser preflight requests.
*/
app.options(/.*/, cors(corsOptions));

/* =========================
   BODY PARSER
========================= */

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

/* =========================
   HEALTH CHECK
========================= */

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Barwal Box Cricket API is running',
  });
});

/* =========================
   AUTH ROUTES
========================= */

app.use(
  '/api/auth',
  authRoutes
);

/* =========================
   BOOKING ROUTES
========================= */

app.use(
  '/api/bookings',
  bookingRoutes
);

/* =========================
   404 API HANDLER
========================= */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'API route not found',
    path: req.originalUrl,
  });
});

/* =========================
   GLOBAL ERROR HANDLER
========================= */

app.use(
  (error, req, res, next) => {
    console.error(
      'Server Error:',
      error
    );

    res.status(500).json({
      success: false,
      message:
        'Internal server error.',
    });
  }
);

/* =========================
   START SERVER
========================= */

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(
        `Server running on http://localhost:${PORT}`
      );
    });
  } catch (error) {
    console.error(
      'Failed to start server:',
      error.message
    );

    process.exit(1);
  }
};

startServer();