const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth.routes');
const departmentRoutes = require('./routes/departments.routes');
const templateRoutes = require('./routes/templates.routes');
const fieldRoutes = require('./routes/fields.routes');
const formRoutes = require('./routes/forms.routes');
const submissionRoutes = require('./routes/submissions.routes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'FormBridge API running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api', fieldRoutes);
app.use('/api/forms', formRoutes);
app.use('/api', submissionRoutes);

app.use((err, req, res, next) => {
  console.error(err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Server Error';

  res.status(statusCode).json({ message });
});

module.exports = app;