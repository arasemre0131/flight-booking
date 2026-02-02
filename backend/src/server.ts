import { createServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import app from './app';
import { connectDatabase } from './config/database';
import { seedAdmin } from './seed/admin.seed';
import { seedTestData } from './seed/testdata.seed';

const PORT = process.env.PORT || 3000;
const SEED_TEST_DATA = process.env.SEED_TEST_DATA === 'true';

// Create HTTP server and Socket.io
const httpServer = createServer(app);
export const io = new SocketServer(httpServer, {
  cors: {
    origin: ['http://localhost:4200', 'http://localhost:80'],
    methods: ['GET', 'POST']
  }
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Join flight room for real-time seat updates
  socket.on('joinFlight', (flightId: string) => {
    socket.join(`flight:${flightId}`);
    console.log(`Socket ${socket.id} joined flight:${flightId}`);
  });

  socket.on('leaveFlight', (flightId: string) => {
    socket.leave(`flight:${flightId}`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

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
    httpServer.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/api/health`);
      console.log('WebSocket enabled for real-time updates');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
