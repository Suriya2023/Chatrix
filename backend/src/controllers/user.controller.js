import User from '../models/user.model.js';
import ContactRequest from '../models/contactRequest.model.js';
import Message from '../models/message.model.js';

export const getChatUsers = async (req, res) => {
  try {
    const userId = req.user._id;
    const messages = await Message.find({
      $or: [{ senderId: userId }, { receiverId: userId }]
    }).sort({ createdAt: -1 });

    const userMap = new Map();
    messages.forEach((msg) => {
      const otherUserId = (msg.senderId.toString() === userId.toString()) ? msg.receiverId : msg.senderId;
      if (!userMap.has(otherUserId.toString())) {
        userMap.set(otherUserId.toString(), msg.createdAt);
      }
    });

    const userIds = [...userMap.keys()];
    const users = await User.find({ _id: { $in: userIds } }).select("-password");
    const sortedUsers = users.map((user) => ({
      ...user.toObject(),
      lastMessageAt: userMap.get(user._id.toString())
    })).sort((a, b) => b.lastMessageAt - a.lastMessageAt);

    res.status(200).json(sortedUsers);
  } catch (err) {
    console.error("Error in getChatUsers:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const searchUsers = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const query = req.query.query;

    if (!query || query.trim() === "") {
      return res.status(400).json({ message: "Search query is required" });
    }

    const regex = new RegExp(query, "i"); // case-insensitive

    const users = await User.find({
      _id: { $ne: loggedInUserId }, // exclude self
      $or: [{ fullName: regex }, { email: regex }],
    }).select("-password");

    res.status(200).json(users);
  } catch (error) {
    console.error("searchUsers error:", error.message);
    res.status(500).json({ message: "Search failed" });
  }
};
export const sendContactRequest = async (req, res) => {
  try {
    const senderId = req.user._id;
    const { receiverId } = req.body;
    if (senderId.toString() === receiverId)
      return res.status(400).json({ message: "You cannot send request to yourself" });

    const alreadyExists = await ContactRequest.findOne({ senderId, receiverId });
    if (alreadyExists)
      return res.status(400).json({ message: "Request already sent" });

    const newRequest = await ContactRequest.create({ senderId, receiverId });
    res.status(201).json(newRequest);
  } catch (err) {
    console.error("Send request error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const acceptContactRequest = async (req, res) => {
  try {
    const userId = req.user._id;
    const requestId = req.params.id;

    const request = await ContactRequest.findById(requestId);
    if (!request || request.receiverId.toString() !== userId.toString()) {
      return res.status(404).json({ message: "Request not found or unauthorized" });
    }

    request.status = 'accepted';
    await request.save();

    res.status(200).json({ message: "Request accepted" });
  } catch (err) {
    console.error("Accept request error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};
export const isContactApproved = async (req, res) => {
  try {
    const user1 = req.user._id;
    const user2 = req.params.id;

    const approvedContact = await ContactRequest.findOne({
      $or: [
        { senderId: user1, receiverId: user2 },
        { senderId: user2, receiverId: user1 }
      ],
      status: 'accepted'
    });

    res.status(200).json({ approved: !!approvedContact });
  } catch (err) {
    console.error("isContactApproved error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};
export const getContactRequests = async (req, res) => {
  try {
    const userId = req.user._id;

    const requests = await ContactRequest.find({
      receiverId: userId,
      status: 'pending'
    }).populate('senderId', '-password');

    res.status(200).json(requests);
  } catch (err) {
    console.error("getContactRequests error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};


export const getAcceptedContacts = async (req, res) => {
  try {
    const userId = req.user._id;

    const acceptedRequests = await ContactRequest.find({
      $or: [{ senderId: userId }, { receiverId: userId }],
      status: 'accepted'
    }).populate('senderId receiverId', '-password');

    const acceptedUsers = acceptedRequests.map((req) =>
      req.senderId._id.toString() === userId.toString()
        ? req.receiverId
        : req.senderId
    );

    res.status(200).json(acceptedUsers);
  } catch (err) {
    console.error('getAcceptedContacts error:', err.message);
    res.status(500).json({ message: 'Failed to fetch accepted contacts' });
  }
};
