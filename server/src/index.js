const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/authRoutes');
const masterDataRoutes = require('./routes/masterDataRoutes');
const projectRoutes = require('./routes/projectRoutes');
const proposalRoutes = require('./routes/proposalRoutes');
const workflowRoutes = require('./routes/workflowRoutes');
const parcelRoutes = require('./routes/parcelRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const awardRoutes = require('./routes/awardRoutes');
const compensationRoutes = require('./routes/compensationRoutes');
const familyRoutes = require('./routes/familyRoutes');
const rrRoutes = require('./routes/rrRoutes');
const possessionRoutes = require('./routes/possessionRoutes');
const intelligenceRoutes = require('./routes/intelligenceRoutes');
const documentRoutes = require('./routes/documentRoutes');
const auditRoutes = require('./routes/auditRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/master', masterDataRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/proposals', proposalRoutes);
app.use('/api/workflows', workflowRoutes);
app.use('/api/parcels', parcelRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/awards', awardRoutes);
app.use('/api/compensations', compensationRoutes);
app.use('/api/families', familyRoutes);
app.use('/api/rr', rrRoutes);
app.use('/api/possession', possessionRoutes);
app.use('/api/intelligence', intelligenceRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/audit', auditRoutes);

// Base route for testing
app.get('/', (req, res) => {
  res.send('BHUMISETU API is running');
});

const http = require('http');
const socketManager = require('./utils/socketManager');

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Server Error' });
});

const PORT = process.env.PORT || 5000;

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io
socketManager.init(server);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
