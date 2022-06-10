var { Client } = require('pg');

var client = new Client({
    user: 'postgres',
    host: '133.167.125.16',
    database: 'mydb',
    password: 'postgres',
    port: 5432
})

module.exports.testdb = async() =>{
    let ans;
    client.connect();
    let result = await doSelect() + 1;
    console.log('id= ' + (result) + ' のレコードを追加します');
    await doInsert(result);
    return (result) + 'を追加しました';
}

function doSelect() {
    const querySelect = {
        text: 'SELECT MAX(CAST(id AS INTEGER)) AS maxid FROM kenko_record',
    }

    ans = client.query(querySelect)
        .then(res => {
            ans = res.rows[0].maxid;
            //console.log(ans);
            return ans;
        })
        .catch(e => console.error(e.stack))
    
    return ans;
}



function doInsert(num) {
    const queryInsert = {
        text: 'INSERT INTO kenko_record (id, name, food) VALUES ($1, $2, $3)',
        values: [num, 'kevin', 'banana'],
    }

    client.query(queryInsert)
        .then(res => {
            //console.log(res);
            client.end();
        })
        .catch(e => console.error(e.stack))
}