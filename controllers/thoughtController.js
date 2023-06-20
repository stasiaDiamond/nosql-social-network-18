const { Thought, User } = require('../models');

module.exports = {
  getThoughts(req, res) {
    Thought.find()
      .then((thoughts) => res.json(thoughts))
      .catch((err) => res.status(500).json(err));
  },

  getSingleThought(req, res) {
    Thought.findOne({ _id: req.params.thoughtId })
      .select('-__v')
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: 'No thought with that ID' })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },

createThought(req, res) {
  Thought.create(req.body)
    .then((createdThought) => {
      thought = createdThought;
      return User.findOneAndUpdate(
        { _id: req.body.userId },
        { $push: { thoughts: thought._id } },
        { new: true }
      );
    })
    .then((user) => {
      if (!user) {
        res.status(404).json({ message: 'No user with that ID' });
      } else {
        res.json({ message: 'Thought created!', thought: thought });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
},

  deleteThought(req, res) {
    Thought.findOneAndRemove({ _id: req.params.thoughtId })
      .then((thought) => {
        if (!thought) {
          res.status(404).json({ message: 'No thought with that ID' });
        } else {
          return User.findOneAndUpdate(
            { thoughts: req.params.thoughtId },
            { $pull: { thoughts: req.params.thoughtId } },
            { new: true }
          );
        }
      })
      .then((user) => {
        if (!user) {
          res.status(404).json({ message: 'No user with that ID' });
        } else {
          res.json({ message: 'Thought deleted!' });
        }
      })
      .catch((err) => res.status(500).json(err));
  },

  updateThought(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $set: req.body },
      { new: true }
    )
      .then((thought) => {
        if (!thought) {
          res.status(404).json({ message: 'No thought with that ID' });
        } else {
          res.json({ message: 'Thought updated!' });
        }
      })
      .catch((err) => res.status(500).json(err));
  },

  addReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $push: { reactions: req.body } },
      { runValidators: true, new: true }
    )
      .then((thought) => {
        if (!thought) {
          res.status(404).json({ message: 'No thought with that ID' });
        } else {
          res.json(thought);
        }
      })
      .catch((err) => res.status(500).json(err));
  },

  removeReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $pull: { reactions: { _id: req.params.reactionId } } },
      { runValidators: true, new: true }
    )
      .then((thought) => {
        if (!thought) {
          res.status(404).json({ message: 'No thought with that ID' });
        } else {
          res.json(thought);
        }
      })
      .catch((err) => res.status(500).json(err));
  },
};
