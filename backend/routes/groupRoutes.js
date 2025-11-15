const express = require('express');
const Group = require('../models/GroupModel');
const { protect, isAdmin } = require('../middleware/authMiddleware');
const groupRouter = express.Router();

// Create a new group (Admin only)
groupRouter.post('/', protect, isAdmin, async (req, res) => {
  console.log('Route hit: /api/groups');
  console.log('User:', req.user);

  try {
    const { name, description } = req.body;

    const group = await Group.create({
      name,
      description,
      admin: req.user._id,
      members: [req.user._id],
    });

    const populatedGroup = await Group.findById(group._id)
      .populate('admin', 'username email')
      .populate('members', 'username email');

    res.status(201).json(populatedGroup);
  } catch (error) {
    console.error('Error creating group:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all groups (any logged-in user can view all)
groupRouter.get('/', protect, async (req, res) => {
  try {
    const groups = await Group.find()
      .populate('admin', 'username email')
      .populate('members', 'username email');
    res.json(groups);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single group (with members + admin)
groupRouter.get('/:groupId', protect, async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId)
      .populate('admin', 'username email')
      .populate('members', 'username email');

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    res.json(group);
  } catch (error) {
    console.error('Error fetching group:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Join group
groupRouter.post('/:groupId/join', protect, async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId);

    if (!group) return res.status(404).json({ message: 'Group not found' });
    if (group.members.includes(req.user._id))
      return res.status(400).json({ message: 'Already a member' });

    group.members.push(req.user._id);
    await group.save();

    res.json({ message: 'Joined group successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Leave group
groupRouter.post('/:groupId/leave', protect, async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId);

    if (!group) return res.status(404).json({ message: 'Group not found' });

    if (!group.members.includes(req.user._id))
      return res.status(400).json({ message: 'Not a member of the group' });

    group.members = group.members.filter(
      (memberId) => memberId.toString() !== req.user._id.toString()
    );

    await group.save();
    res.json({ message: 'Left group successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }



});


module.exports = groupRouter;

