import express from 'express';
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

function startSelfHealthCheck() {
  setInterval(async () => {
    try {
      const response = await fetch('http://127.0.0.1:3000/');
      console.log(`${process.env.RUNTIME}-${new Date().toISOString()}: check - ${response.status}`);
    } catch (error) {
      console.log(`${process.env.RUNTIME}-${new Date().toISOString()}: check failed`);
    }
  }, 50);
}

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
  startSelfHealthCheck();
})
