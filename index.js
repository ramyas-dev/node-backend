import app from './app.js';
import 'dotenv/config';

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('Database connected!');
});
