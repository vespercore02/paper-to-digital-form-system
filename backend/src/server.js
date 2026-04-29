require('dotenv').config();

const app = require('./app');
const { connectDB } = require('./config/db');
const db = require('./models');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    console.log('Database connected');

    await db.sequelize.sync();
    console.log('Database synced');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Server failed to start:', error);
  }
};

startServer();