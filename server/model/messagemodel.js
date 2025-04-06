const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    message: {
      text: {
        type: String,
        required: true,
      },
    },
    users: [mongoose.Schema.Types.ObjectId], // Optional: add `ref` if users are User models
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true, // Moved to the second argument
  }
);

module.exports = mongoose.model("Messages", messageSchema);
