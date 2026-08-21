import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import householdRoutes from './routes/householdRoutes';
import citizenRoutes from './routes/citizenRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
console.log("🔥 AUTH ROUTES LOADED");
app.use('/api/auth', authRoutes);
app.use('/api/household', householdRoutes);
app.use('/api/citizen', citizenRoutes);
app.get('/api/auth/test', (_req, res) => {
  res.json({ message: 'Auth router mounting works' });
});


// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });

  // Keep process active in CLI runners that do not retain the HTTP listener.
  setInterval(() => {}, 10000);
}

export default app;
