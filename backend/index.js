const express = require('express')
const app = express()
const path = require('path');
const db = require('./testdb.js');
const port = process.env.PORT || 3001;

app.use(express.static(path.join(__dirname, '../frontend/build')));

app.get("/api", (req, res) => {
  let text = db.testdb();
  text.then( e=> { 
  res.json({ message: e });
  }
  )
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname,'../frontend/build/index.html'));
});

app.listen(port, () => {
  console.log(`listening on *:${port}`);
})