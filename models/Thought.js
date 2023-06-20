const mongoose = require('mongoose');

const thoughtSchema = new mongoose.Schema({
  thoughtText: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 280,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    get: (createdAtVal) => dateFormat(createdAtVal),
  },
  username: {
    type: String,
    required: true,
  },
  reactions: [
    {
      reactionBody: {
        type: String,
        required: true,
      },
      username: {
        type: String,
        required: true,
      }
    }
  ]
});

const Thought = mongoose.model('Thought', thoughtSchema);

module.exports = Thought;
