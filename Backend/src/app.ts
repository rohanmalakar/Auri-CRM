import express, { NextFunction, Application, Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import 'reflect-metadata';
import dotenv from 'dotenv';
import { PORT } from '@utils/contants';
import createLogger from '@utils/logger';
import { errorHandler } from '@middleware/error';
import orgUser from '@controller/orgUser';
import organization from '@controller/organization';
import admin from '@controller/admin';
import branch from '@controller/branch';
import loyaltyProgram from '@controller/loyaltyProgram';

import https from 'https';
import fs from 'fs';
import path from 'path';

import pool from '@utils/db';
import sequelize from '@utils/sequelize';

dotenv.config();
const logger = createLogger('@app');

// Global crash/error catchers
// process.on('unhandledRejection', (reason, promise) => {
//   console.error('Unhandled Rejection:', reason);
// });

// process.on('uncaughtException', err => {
//   console.error('Uncaught Exception:', err);
//   process.exit(1);
// });

async function start() {
  const app: Application = express();

  // Test DB connection (optional but useful)
  try {
    await pool.query('SELECT 1');
    console.log('✅ Database connected successfully');
  } catch (err) {
    console.error('❌ Failed to connect to the database:', err);
    process.exit(1);
  }

  // Middlewares
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // Serve static files from uploads directory
  app.use('/uploads', express.static(path.join(__dirname, '../uploads')));


  
  const allowedOrigins = [
  'http://localhost:5183',
  "http://192.168.29.2:5183"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed from this origin'));
    }
  },
  credentials: true
}));

  app.use(morgan('combined'));

  // Sync Sequelize models
  try {
    await sequelize.sync({ alter: true }); // Use { force: true } to drop tables or { alter: true } to update schema
    console.log('✅ Sequelize models synced ');
  } catch (err) {
    console.error('❌ Failed to sync Sequelize models:', err);
  }


  // Routes
  app.use('/api/v1/orgUser', orgUser);
  app.use('/api/v1/organization', organization);
  app.use('/api/v1/admin', admin);
  app.use('/api/v1/branch', branch);
  app.use('/api/v1/loyalty/programs', loyaltyProgram);


  // Health check route
  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', uptime: process.uptime(), timestamp: Date.now() });
  });

  // Custom file size error handling middleware (if needed)
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({
        success: false,
        message: 'File size exceeds limit.',
      });
    }
    console.error('Unhandled error middleware:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Internal Server Error',
    });
  });

  // Global error handler (after all routes)
  app.use(errorHandler);


  //-------------------------------------Local Code---------------------------------//
  app.listen(PORT, '0.0.0.0', () => {
    logger.info(`🚀 App is listening on port ${PORT} (accessible from all hosts)`);
  });
  // -------------------------------------Local Code End---------------------------------//


  //-------------------------------------Production  Start---------------------------------//
  // const port = 6002;
  // const certPath = '/etc/letsencrypt/live/qc.atlasits.cloud/fullchain.pem'; // Adjust path as needed
  // const keyPath = '/etc/letsencrypt/live/qc.atlasits.cloud/privkey.pem';   // Adjust path as needed
  // // HTTPS options
  // const options = {
  //   key: fs.readFileSync(keyPath),
  //   cert: fs.readFileSync(certPath),
  // };
  // app.get('/', (req, res) => {
  //   res.send('<h1>HTTPS is working with TypeScript and Node.js!</h1>');
  // });
  
  // // Create and start the HTTPS server
  // https.createServer(options, app).listen(port, () => {
  //   console.log(`HTTPS Server listening on port ${port}`);
  //   console.log(`Access at: https://localhost:${port}`);
  // });

  //-------------------------------------Production End---------------------------------//  

}

// Start with top-level error handling
start()
.catch((err) => {
  console.error('❌ Fatal error during app startup:', err);
  process.exit(1);
});

console.log("🚀 Safwa API started: Build time", new Date().toISOString());




