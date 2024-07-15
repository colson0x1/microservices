const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Repository for every posts that being created
const posts = {};

// This GET request handler was implemented before I wrote Query Microservice
// i.e Now this GET request handler is unused
// Query Microservice will do the part of fetching/retrieving all the posts
// and comments
// I only left it here to test out post endpoint when Im done configuring
// Ingress NGINX
app.get('/posts', (req, res) => {
  res.send(posts);
});

app.post('/posts/create', async (req, res) => {
  const id = randomBytes(4).toString('hex');
  const { title } = req.body;

  posts[id] = {
    id,
    title,
  };

  // await axios.post('http://localhost:4005/events', {
  await axios.post('http://event-bus-srv:4005/events', {
    type: 'PostCreated',
    data: {
      id,
      title,
    },
  });

  res.status(201).send(posts[id]);
});

app.post('/events', (req, res) => {
  console.log('Received Event', req.body.type);

  res.send({});
});

app.listen(4000, () => {
  console.log('v27');
  console.log('Listening on 4000');
});
