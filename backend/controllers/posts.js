const Post = require('../models/post');

module.exports.createPost = (req, res, next) => {
  const url = `${req.protocol}://${req.get('host')}`;
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: `${url}/images/${req.file.filename}`,
    creator: req.userData.userId,
  });
  post
    .save()
    .then(({ _id: id, title, content, imagePath }) => {
      res.status(201).json({
        message: 'Post added successfully!',
        post: {
          id,
          title,
          content,
          imagePath,
        },
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'Creating a post failed!',
      });
    });
};

module.exports.updatePost = (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + '://' + req.get('host');
    imagePath = url + '/images/' + req.file.filename;
  }
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath,
    creator: req.userData.userId,
  });
  Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post)
    .then(result => {
      if (result.nModified > 0) {
        res.status(200).json({ message: 'Update successful!' });
      } else {
        res.status(401).json({ message: 'Not authorized!' });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Couldn't udpate post!",
      });
    });
};

module.exports.getPosts = (req, res, next) => {
  const pageSize = +req.query.pageSize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;
  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  postQuery
    .then(documents => {
      fetchedPosts = documents;
      return Post.countDocuments();
    })
    .then(count => {
      res.status(200).json({
        message: 'Posts fetched successfully',
        posts: fetchedPosts,
        maxPosts: count,
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'Fetching posts failed!',
      });
    });
};

module.exports.getPost = (req, res, next) => {
  Post.findById(req.params.id)
    .then(post => {
      post ? res.status(200).json(post) : res.status(400).json({ message: 'Post not found' });
    })
    .catch(error => {
      res.status(500).json({
        message: 'Fetching post failed!',
      });
    });
};

module.exports.deletePost = (req, res, next) => {
  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId })
    .then(result => {
      // console.log(result);
      if (result.n > 0) {
        res.status(200).json({ message: 'Deletion successful!' });
      } else {
        res.status(401).json({ message: 'Not authorized!' });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: 'Deleting posts failed!',
      });
    });
};
