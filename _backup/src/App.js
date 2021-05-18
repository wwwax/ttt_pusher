import { useState, useEffect } from 'react';
import Pusher from 'pusher-js';
import axios from 'axios';

export default function App() {
  const [state, setState] = useState({
    squares: Array(9).fill(null),
    xIsNext: true,
    move: 'hello',
  });

  const squares = state.squares;
  const xIsNext = state.xIsNext;

  // ================

  let statusText;
  const winner = winnerCheck(squares);

  if (winner) {
    statusText = `Winner: ${winner}`;
  } else {
    statusText = `Next: ${xIsNext ? 'X' : 'O'}`;
  }

  // ================

  const handleSquareClick = (id) => {
    const copySquares = squares.slice();

    if (copySquares[id] || winner) {
      return;
    }

    copySquares[id] = xIsNext ? 'X' : 'O';

    setState((prev) => ({
      ...prev,
      squares: copySquares,
      xIsNext: !prev.xIsNext,
    }));

    const payload = 'lorem ipsum';
    axios.post('http://localhost:5000/move', payload);
  };

  // ================

  useEffect(() => {
    const pusher = new Pusher('0082faa9fdf79271994d', { cluster: 'eu' });
    const channel = pusher.subscribe('ttt');
    channel.bind('move', (data) => {
      setState((prev) => ({ ...prev, move: data }));
    });
  });

  // ================

  return (
    <div className='app'>
      <div className='board'>
        {squares.map((square, idx) => {
          return (
            <div className='board-item' key={idx} onClick={() => handleSquareClick(idx)}>
              {square}
            </div>
          );
        })}
      </div>

      <div className='status'>{statusText}</div>

      <div>move: {state.move}</div>
    </div>
  );
}

// ================

const winnerCheck = (squares) => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];

    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }

  return null;
};
