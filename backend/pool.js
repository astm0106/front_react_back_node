const { Pool } = require("pg");

// 接続先文字列
const connectionString = 'postgres://postgres:postgres@133.167.125.16:5432/mydb';

// DB情報をもったプールを生成
const pool = new Pool({
    connectionString: connectionString,
    max: 2          // 保持するコネクション数
});

module.exports = pool;