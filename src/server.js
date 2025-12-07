import app from './app.js';
import { config } from './config/index.js';

const PORT = config.port;

app.listen(PORT, () => {
  console.log(`🚀 Words Memory Service is running on port ${PORT}`);
  console.log(`📚 Access random words at: http://localhost:${PORT}/api/words/random`);
  console.log(`🌍 Environment: ${config.nodeEnv}`);
});

