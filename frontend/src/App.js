import './App.css';
import { useState, useEffect } from 'react'

function App() {
  const [message, setMessage] = useState('ボタンを押してください');
  const [message2, setMessage2] = useState('');
  const [result, setResult] = useState(
    [
      {
        message: "",
        posting_time: ""
      }
    ]
  );

  //useEffect(() => addMsg(), [])
  return (
    <div className="App">
      <h1>フロントエンド</h1>
      <p>{message}</p>
      <button onClick={() => addMsg()}>接続</button>
      <form class="fetchForm">
        <textarea
          placeholder='メッセージを入力してください'
          rows="4"
          cols="40"
          onChange={(e) => setMessage2(e.target.value)}
          value={message2}
        />
      </form>
      <button onClick={() => addMsg2()}>メッセージ送信</button>
      {result.map((str) =>
        <div>
          <p>{str.message}</p>
          {str.posting_time}
        </div>
      )}
    </div>
  );

  function addMsg() {
    fetch('/api')
      .then((res) => res.json())
      .then((data) => setMessage(data.message));
  }

  function addMsg2() {
    if (message2 !== "") {
      
      const jsonData = {
        message: message2
      }
      setMessage2("");

      fetch('/api2',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(jsonData)
        }
      )
        .then((res) => res.json())
        .then((data) => {
          const array = [];
          for (const elem of data.rows) {
            array.push(elem);
          }
          setResult(array);
        }
        );
    }
  }
}

export default App;