import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

// Request logging middleware
app.use((req, _res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
});

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'taskgraph-api',
  });
});

app.get('/api/tasks', (_req, res) => {
  // Placeholder for tasks endpoint
  res.json({
    tasks: [],
    message: 'Tasks API endpoint - ready for implementation',
  });
});

app.listen(PORT, () => {
  console.log(`TaskGraph API server running on port ${PORT}`);
});
