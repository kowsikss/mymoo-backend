const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin'); // Your Admin model

// GET all admins
router.get('/admins', async (req, res) => {
  try {
    const admins = await Admin.find().populate('kosalaId');
    res.json(admins);
  } catch (error) {
    console.error('Error fetching admins:', error);
    res.status(500).json({ message: 'Error fetching admins', error: error.message });
  }
});

// GET single admin
router.get('/admins/:id', async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id).populate('kosalaId');
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    res.json(admin);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching admin', error: error.message });
  }
});

// POST create admin
router.post('/admins', async (req, res) => {
  try {
    const admin = new Admin(req.body);
    await admin.save();
    res.status(201).json(admin);
  } catch (error) {
    res.status(400).json({ message: 'Error creating admin', error: error.message });
  }
});

// PUT update admin
router.put('/admins/:id', async (req, res) => {
  try {
    const admin = await Admin.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(admin);
  } catch (error) {
    res.status(400).json({ message: 'Error updating admin', error: error.message });
  }
});

// DELETE admin
router.delete('/admins/:id', async (req, res) => {
  try {
    await Admin.findByIdAndDelete(req.params.id);
    res.json({ message: 'Admin deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting admin', error: error.message });
  }
});

module.exports = router;