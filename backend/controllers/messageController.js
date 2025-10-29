const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const { sendNewChatEmail } = require('../utils/emailService');

// Initiate a conversation request (sends default message, sets status=pending)
exports.initiateConversation = async (req, res) => {
  try {
    const { receiver, listing } = req.body;
    if (!receiver) return res.status(400).json({ message: 'Receiver required' });

    // find or create conversation
    let convo = await Conversation.findOne({
      participants: { $all: [req.user.id, receiver] },
      listing: listing || null,
    });

    if (!convo) {
      convo = await Conversation.create({
        participants: [req.user.id, receiver],
        listing: listing || null,
        status: 'pending',
        initiatedBy: req.user.id,
      });
    }

    // default message
    const content = `Hi! I'm interested in your listing. Is it still available?`;
    const message = await Message.create({ sender: req.user.id, receiver, content, listing });
    convo.lastMessageAt = new Date();
    await convo.save();

    // email notification (best-effort)
    try { await sendNewChatEmail(receiver, req.user.name || 'A student'); } catch (_) {}

    res.status(201).json({ conversation: convo, message });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Accept conversation
exports.acceptConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const convo = await Conversation.findById(conversationId);
    if (!convo) return res.status(404).json({ message: 'Conversation not found' });
    if (!convo.participants.map(String).includes(req.user.id)) {
      return res.status(403).json({ message: 'Not a participant' });
    }
    convo.status = 'accepted';
    await convo.save();
    res.json(convo);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Send a message (only if accepted or self-initiated pending first message)
exports.sendMessage = async (req, res) => {
  try {
    const { receiver, content, listing, conversationId } = req.body;
    if (!receiver && !conversationId) return res.status(400).json({ message: 'receiver or conversationId required' });

    let convo = conversationId
      ? await Conversation.findById(conversationId)
      : await Conversation.findOne({ participants: { $all: [req.user.id, receiver] }, listing: listing || null });

    if (!convo) return res.status(403).json({ message: 'Conversation not found' });
    if (!convo.participants.map(String).includes(req.user.id)) {
      return res.status(403).json({ message: 'Not a participant' });
    }
    if (convo.status !== 'accepted') {
      return res.status(403).json({ message: 'Conversation not accepted yet' });
    }

    const message = await Message.create({ sender: req.user.id, receiver: receiver || convo.participants.find(id => String(id) !== req.user.id), content, listing: listing || convo.listing });
    convo.lastMessageAt = new Date();
    await convo.save();
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

// List conversations for the current user
exports.getConversations = async (req, res) => {
  try {
    const convos = await Conversation.find({ participants: req.user.id })
      .populate('participants', 'name email')
      .populate('listing', 'title price category')
      .populate('initiatedBy', 'name email')
      .sort({ lastMessageAt: -1 });
    res.json(convos);
  } catch (err) {
    console.error('Error fetching conversations:', err);
    res.status(500).json({ message: 'Server error' });
  }
};