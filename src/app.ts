import express, { Application } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import orderRoutes from './routes/order.routes';
import branchRoutes from './routes/branch.routes';

// Ortam değişkenlerini yükle
dotenv.config();

const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json()); // JSON body parse

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/branches', branchRoutes);

// Health check endpoint
app.get('/', (_req, res) => {
  res.send('GÜNER API çalışıyor 💥');
});

// Veritabanına bağlan ve sunucuyu başlat
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('❌ MONGO_URI tanımlı değil!');
  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB bağlantısı başarılı');
    app.listen(PORT, () => {
      console.log(`🚀 Server ${PORT} portunda çalışıyor`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB bağlantı hatası:', err);
    process.exit(1);
  });
