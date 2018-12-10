const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
const postsRouter = require('./routes/posts');
const userRoutes = require('./routes/user');

mongoose
  .connect(
    'mongodb+srv://ryan:fLUMt7l9Zjpvxomg@cluster0-hyran.mongodb.net/node-angular?retryWrites=true',
    { useNewUrlParser: true }
  )
  .then(() => {
    console.log('connected to database!');
  })
  .catch(() => {
    console.log('connection failed');
  });

mongoose.set('useCreateIndex', true);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/images', express.static(path.join('backend/images')));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
  next();
});

app.use('/api/posts', postsRouter);
app.use('/api/user', userRoutes);

module.exports = app;
