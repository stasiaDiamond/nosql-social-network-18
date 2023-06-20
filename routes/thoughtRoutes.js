const router = require('express').Router();

const {
    getThoughts,
    getSingleThought,
    createThought,
    deleteThought,
    updateThought,
    addReaction,
    removeReaction
  } = require('../controllers/thoughtController');
  
  // /api/thoughts
  router.route('/').get(getThoughts).post(createThought);
  
  // /api/thoughts/:thoughtId
  router.route('/:thoughtId').get(getSingleThought);
  
  router.route('/:thoughtId').put(updateThought);
  
  router.route('/:thoughtId').delete(deleteThought);

// /api/IdOfTheThing/:thoughtId/reactions
  router.route('/:thoughtId/reactions').post(addReaction);

// /api/IdOfTheThing/:thoughtId/reactions/:reactionId
  router.route('/:thoughtId/reactions/:reactionId').delete(removeReaction);


module.exports = router;