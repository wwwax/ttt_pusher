const Pusher = require('pusher');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const pusher = new Pusher({
  appId: '1203640',
  key: '0082faa9fdf79271994d',
  secret: 'e5be75bdddb8a810b6bf',
  cluster: 'eu',
});

app.set('PORT', process.env.PORT || 5000);

app.post('/move', (req, res) => {
  const payload = req.body;
  pusher.trigger('ttt', 'move', payload);
  res.send(payload);
});

app.listen(app.get('PORT'), () => console.log('Listening at ' + app.get('PORT')));
