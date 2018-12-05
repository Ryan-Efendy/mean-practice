const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');

const Post = require('./models/post');

mongoose
  .connect('mongodb+srv://ryan:fLUMt7l9Zjpvxomg@cluster0-hyran.mongodb.net/test?retryWrites=true')
  .then(() => {
    console.log('connected to database!');
  })
  .catch(() => {
    console.log('connection failed');
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
  next();
});

app.post('/api/posts', (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
  });
  console.log(post);
  res.status(201).json({
    message: 'Post ',
  });
});

app.get('/api/posts', (req, res, next) => {
  const posts = [
    { id: '1234567890', title: 'first post', content: `this is the first's post content` },
    { id: '1234567890', title: 'first post', content: `this is the first's post content` },
    { id: '1234567890', title: 'first post', content: `this is the first's post content` },
  ];

  res.status(200).json({
    message: 'Posts fetched successfully',
    posts: posts,
  });
});

module.exports = app;
