const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const pool = require('./pool.js');
const port = process.env.PORT || 3001;

app.use(express.static(path.join(__dirname, '../frontend/build')));

// urlencodedとjsonは別々に初期化する
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.get("/api", async function (req, res, next) {
  // コネクション取得
  const connect = await pool.connect();
  // クエリ発行
  const result = await connect.query('SELECT MAX(CAST(id AS INTEGER)) AS maxid FROM kenko_record');
  const ans = result.rows[0].maxid + 1;
  const queryInsert = {
    text: 'INSERT INTO kenko_record (id, name, food) VALUES ($1, $2, $3)',
    values: [ans, 'kevin', 'banana'],
  }
  await connect.query(queryInsert);
  // コネクション返却
  connect.release();
  //console.log(ans);
  res.json({ message: ans });
});

app.post("/api2", async function (req, res, next) {
  // コネクション取得
  const connect = await pool.connect();
  // クエリ発行
  const queryInsert = {
    text: 'INSERT INTO msg_board (message, posting_time) VALUES ($1, NOW())',
    values: [req.body.message],
  }
  await connect.query(queryInsert);
  const result = await connect.query(
    'SELECT message, to_char(posting_time, \'YYYY/MM/DD HH24:MI:SS\') AS posting_time FROM msg_board ORDER BY posting_time DESC LIMIT 50'
    );
  //console.log(result);

  // コネクション返却
  connect.release();
  res.json(result);
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});

app.listen(port, () => {
  console.log(`listening on *:${port}`);
})