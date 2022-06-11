const express = require('express')
const app = express()
const path = require('path');
const pool = require('./pool.js');
const port = process.env.PORT || 3001;

app.use(express.static(path.join(__dirname, '../frontend/build')));

app.get("/api", async function (req, res, next) {
  console.log("=============================");

  // 取得前
  console.log('取得前 totalCount: ', pool.totalCount);
  console.log('取得前 idleCount: ', pool.idleCount);
  console.log('取得前 waitingCount: ', pool.waitingCount);

  // コネクション取得
  const connect = await pool.connect();

  // 取得後
  console.log('取得後 totalCount: ', pool.totalCount);
  console.log('取得後 idleCount: ', pool.idleCount);
  console.log('取得後 waitingCount: ', pool.waitingCount);

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

  // 返却後
  console.log('返却後 totalCount: ', pool.totalCount);
  console.log('返却後 idleCount: ', pool.idleCount);
  console.log('返却後 waitingCount: ', pool.waitingCount);

  console.log(ans);

  res.json({ message: ans});

});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});

app.listen(port, () => {
  console.log(`listening on *:${port}`);
})