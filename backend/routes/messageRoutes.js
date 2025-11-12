const express = require("express");
const Message = require("../models/ChatModel");
const { protect } = require("../middleware/authMiddleware");

const messageRouter = express.Router();

// SEND MESSAGE
messageRouter.post("/", protect, async (req, res) => {
  try {
    const { content, groupId } = req.body;

    if (!content || !groupId) {
      return res.status(400).json({ message: "Missing content or groupId" });
    }

    // Create new message
    let message = await Message.create({
      sender: req.user._id,
      content,
      group: groupId,
    });

    // Properly populate sender and group before responding
    message = await message.populate([
      { path: "sender", select: "username email" },
      { path: "group", select: "name members" },
    ]);

    res.status(201).json(message);
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({
      message: "Server error while sending message",
      error: error.message,
    });
  }
});

// GET MESSAGES FOR A GROUP
messageRouter.get("/:groupId", protect, async (req, res) => {
  try {
    const groupId = req.params.groupId;

    if (!groupId) {
      return res.status(400).json({ message: "Group ID is required" });
    }

    const messages = await Message.find({ group: groupId })
      .populate("sender", "username email")
      .populate("group", "name")
      .sort({ createdAt: 1 }); 

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({
      message: "Server error while fetching messages",
      error: error.message,
    });
  }
});

module.exports = messageRouter;
