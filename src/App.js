import { useState, useEffect } from 'react';
import axios from 'axios';
import Pusher from 'pusher-js';

export default function App() {
  const [state, setState] = useState({
    squares: [null, null],
  });

  const handleSquareClick = (idx) => {
    const copySquares = state.squares.slice();
    copySquares[idx] = 'X';

    const payload = { copySquares: copySquares };
    axios.post('http://localhost:5000/fill', payload);
  };

  useEffect(() => {
    const pusher = new Pusher('0082faa9fdf79271994d', { cluster: 'eu' });
    const channel = pusher.subscribe('board');

    channel.bind('fill', (data) => {
      setState((prev) => ({ ...prev, squares: data.copySquares }));
    });
  });

  return (
    <div>
      <div className='board'>
        {state.squares.map((square, idx) => {
          return (
            <div className='square' onClick={() => handleSquareClick(idx)} key={idx}>
              {square}
            </div>
          );
        })}
      </div>
    </div>
  );
}
