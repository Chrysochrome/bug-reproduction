import express from 'express';
import mongoose from 'mongoose';

const app = express()
const port = 3000

const client = await mongoose.connect(process.env.MONGO_CONNECTION_STRING || '')

console.log('Connected to MongoDB');

const results = [];

setInterval(() => {
  results.push({
    ...process.memoryUsage(),
    timestamp: new Date().toISOString()
  });
}, 60 * 1000);

app.get('/', async (req, res) => {
  const col = client.connection.db.collection('system.version');
  const data = await col.find({}).toArray();

  console.log(data);
  res.send(data);
})

app.get('/memory', (req, res) => {
  // results to csv
  const csv = results.map(r => {
    return `${r.timestamp},${r.rss},${r.heapTotal},${r.heapUsed},${r.external},${r.arrayBuffers}`;
  }).join('\n');
  res.setHeader('Content-Type', 'text/csv');
  // filename
  res.setHeader('Content-Disposition', `attachment; filename="${process.env.RUNTIME ?? 'local'}_memory_usage.csv"`);
  res.send('timestamp,rss,heapTotal,heapUsed,external,arrayBuffers\n' + csv);
})

function startSelfHealthCheck() {
  setInterval(async () => {
    try {
      const response = await fetch('http://127.0.0.1:3000/');
      console.log(`${process.env.RUNTIME}-${new Date().toISOString()}: check - ${response.status}`);
    } catch (error) {
      console.log(`${process.env.RUNTIME}-${new Date().toISOString()}: check failed`);
    }
  }, 25 * 1000);
}

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
  startSelfHealthCheck();
})
