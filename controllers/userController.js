const User = require('../models/User');
const Thought = require('../models/Thought');

module.exports = {
  getUsers(req, res) {
    User.find()
      .then((users) => res.json(users))
      .catch((err) => res.status(500).json(err));
  },

  getSingleUser(req, res) {
    User.findOne({ _id: req.params.userId })
      .select('-__v')
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No user with that ID' })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },

  createUser(req, res) {
    User.create(req.body)
      .then((user) => res.json(user))
      .catch((err) => res.status(500).json(err));
  },

  deleteUser(req, res) {
    User.findOneAndDelete({ _id: req.params.userId })
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: 'No user with that ID' });
        }
        return res.json({ message: 'User has been deleted!' });
      })
      .catch((err) => res.status(500).json(err));
  },

  updateUser(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $set: req.body },
      { new: true }
    )
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: 'No user with that ID' });
        }
        return res.json({ message: 'User has been updated!' });
      })
      .catch((err) => res.status(500).json(err));
  },

  addFriend(req, res) {
    const { friendId } = req.body;

    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $addToSet: { friends: friendId } },
      { runValidators: true, new: true }
    )
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No user with this ID' })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },

  removeFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $pull: { friends: { friendId: req.params.friendId } } },
      { runValidators: true, new: true }
    )
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No user with this ID' })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },

  deleteFriend(req, res) {
    const { userId, friendId } = req.params;

    User.findByIdAndUpdate(
      userId,
      { $pull: { friends: friendId } },
      { new: true }
    )
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: 'No user with this ID' });
        }
        res.json(user);
      })
      .catch((err) => res.status(500).json(err));
  },

  addReaction(req, res) {
    const { thoughtId } = req.params;
    const { reactionBody, username } = req.body;

    Thought.findOneAndUpdate(
      { _id: thoughtId },
      { $push: { reactions: { reactionBody, username } } },
      { new: true, runValidators: true }
    )
      .then((thought) => {
        if (!thought) {
          return res.status(404).json({ message: 'No thought with this ID' });
        }

        res.json(thought);
      })
      .catch((err) => res.status(500).json(err));
  }
};
