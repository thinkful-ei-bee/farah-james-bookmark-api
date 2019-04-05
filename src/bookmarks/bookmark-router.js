const express = require('express');
const uuid = require('uuid/v4');
const logger = require('../logger')
const {bookmarks} = require('../store')

const bookmarkRouter = express.Router()
const bodyParser = express.json()

//BOOKMARK 
bookmarkRouter
  .route('/bookmarks')
  .get((req, res) => {
    res.json(bookmarks);
  })
  .post(bodyParser, (req, res) => {
    const { title, description, url, rating } = req.body;

  if (!title) {
    logger.error(`Title is required`);
    return res
      .status(400)
      .send('Invalid data');
  }
  if (!description) {
    logger.error(`Description is required`);
    return res
      .status(400)
      .send('Invalid data');
  }
  if (!url) {
    logger.error(`Url is required`);
    return res
      .status(400)
      .send('Invalid data');
  }
  if (!rating) {
    logger.error(`Rating is required`);
    return res
      .status(400)
      .send('Invalid data');
  }
  if(isNaN(rating)){
    logger.error(`Rating must be a number`);
    return res
      .status(400)
      .send('Rating must be a number');
  }

  //generate ID and push bookmark object into the bookmarks array
  const id = uuid();
  const bookmark = {
    id,
    title,
    description,
    url,
    rating
  };
  bookmarks.push(bookmark);

  //log bookmark creation and send response
  logger.info(`Bookmark with id ${id} created`);

  res
  .status(201)
  .location(`http://localhost:8000/bookmarks/${id}`)
  .json(bookmarks);
})

//BOOKMARK/:ID
bookmarkRouter
  .route('/bookmarks/:id')
  .get((req, res) => {
  const { id } = req.params;
  const bookmarkId = bookmarks.find(bm => bm.id == id);

  if(!bookmarkId){
    logger.error(`Bookmark with id ${id} not found.`);
    return res.status(404).send('404 Not Found.');
  }

  res.json(bookmarkId);
  })
  .delete((req, res) => {
  const { id } = req.params;

  const bookmarkIndex = bookmarks.findIndex(bm => bm.id == id);

  if (bookmarkIndex === -1) {
    logger.error(`Bookmark with id ${id} not found.`);
    return res
    .status(404)
    .send('Not Found');
  }

  bookmarks.splice(bookmarkIndex, 1);

  logger.info(`Bookmark with id ${id} deleted.`);
  res
    .status(204)
    .end();
})

module.exports = bookmarkRouter