const Message = require('../models/Message');

// Send a message
exports.sendMessage = async (req, res) => {
  try {
    const { receiver, content, listing } = req.body;
    const message = new Message({
      sender: req.user.id,
      receiver,
      content,
      listing,
    });
    await message.save();
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get messages between two users (optionally filtered by listing)
exports.getMessages = async (req, res) => {
  try {
    const { userId, listingId } = req.query;
    const filter = {
      $or: [
        { sender: req.user.id, receiver: userId },
        { sender: userId, receiver: req.user.id }
      ]
    };
    if (listingId) filter.listing = listingId;
    const messages = await Message.find(filter).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
}; 