import { useState, useEffect } from 'react';
import axios from 'axios';
import Pusher from 'pusher-js';

export default function App() {
  const [state, setState] = useState({
    squares: Array(9).fill(null),
    xIsNext: true,
  });

  let statusMessage;

  statusMessage = `Next: ${state.xIsNext ? 'X' : 'O'}`;

  const handleSquareClick = (idx) => {
    const squares = state.squares.slice();
    squares[idx] = state.xIsNext ? 'X' : 'O';
    const xIsNext = !state.xIsNext;

    const payload = {
      squares,
      xIsNext,
    };

    axios.post('http://localhost:5000/fill', payload);
  };

  useEffect(() => {
    const pusher = new Pusher('0082faa9fdf79271994d', { cluster: 'eu' });
    const channel = pusher.subscribe('board');

    channel.bind('fill', (data) => {
      setState({
        squares: data.squares,
        xIsNext: data.xIsNext,
      });
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

      <div className='status'>{statusMessage}</div>
    </div>
  );
}

function winnerChecking(squares) {
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
}
