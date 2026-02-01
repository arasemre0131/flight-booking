import app from './app';
import { connectDatabase } from './config/database';
import { seedAdmin } from './seed/admin.seed';
import { seedTestData } from './seed/testdata.seed';

const PORT = process.env.PORT || 3000;
const SEED_TEST_DATA = process.env.SEED_TEST_DATA === 'true';

const startServer = async (): Promise<void> => {
  try {
    // Connect to database
    await connectDatabase();

    // Seed admin on first run
    await seedAdmin();

    // Seed test data if enabled
    if (SEED_TEST_DATA) {
      await seedTestData();
    }

    // Start server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
