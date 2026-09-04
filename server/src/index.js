const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

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

app.use('/api/auth', authRoutes);
app.use('/api/master', masterDataRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/proposals', proposalRoutes);
app.use('/api/workflows', workflowRoutes);
app.use('/api/parcels', parcelRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/awards', awardRoutes);

// Base route for testing
app.get('/', (req, res) => {
  res.send('BHUMISETU API is running');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Server Error' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
