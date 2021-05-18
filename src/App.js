import { useState, useEffect } from 'react';
import axios from 'axios';
import Pusher from 'pusher-js';

export default function App() {
  const [state, setState] = useState({
    text: '',
    messages: [],
  });

  const handleChange = (e) => {
    setState((prev) => ({
      ...prev,
      text: e.target.value,
    }));
  };

  const handleSubmit = () => {
    const payload = { message: state.text };
    axios.post('http://localhost:5000/message', payload);
  };

  useEffect(() => {
    const pusher = new Pusher('0082faa9fdf79271994d', { cluster: 'eu' });
    const channel = pusher.subscribe('chat');

    channel.bind('message', (data) => {
      console.log('xxxx', data);

      setState((prev) => ({
        ...prev,
        text: '',
        messages: [...prev.messages, data.message],
      }));
    });
  }, []);

  return (
    <div className='app'>
      <input type='text' value={state.text} onChange={handleChange} />
      <button onClick={handleSubmit}>Send</button>

      <div className='message_list'>
        {state.messages.map((item) => (
          <div className='message_list-item' key={item}>
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
