const express = require('express');
const router = express.Router();
const {
    registerUser,
    loginUser,
    logoutUser,
    getAllUsers,
    deleteUser,
    updateUserRole
} = require('../controllers/auth.controller');

// Register endpoint
router.post('/register', registerUser);

// Login endpoint
router.post('/login', loginUser);

// Logout endpoint (optional)
router.post('/logout', logoutUser);

const verifyToken = require('../middleware/verifyToken');

// Get all users
router.get('/users', verifyToken, getAllUsers);

router.delete('/users/:id', verifyToken, deleteUser);

// Update a user role
router.put('/users/:id', verifyToken, updateUserRole);

// Update a user role
router.put('/users/:id', updateUserRole);

module.exports = router;
