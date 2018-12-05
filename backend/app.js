const express = require('express');

const app = express();

app.use('/api/posts', (req, res, next) => {
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
