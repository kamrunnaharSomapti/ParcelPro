const express = require('express');
const router = express.Router();
const parcelController = require('../controllers/parcelController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

router.use(protect);

// Customer routes
/**
 * @swagger
 * /parcels/book:
 *   post:
 *     summary: Book a new parcel (Customer only)
 *     tags: [Parcels]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Parcel created successfully
 */
router.post('/book', restrictTo('customer'), parcelController.createParcel);

// Admin routes
/**
 * @swagger
 * /parcels/all:
 *   get:
 *     summary: Get all parcels (Admin only)
 *     tags: [Parcels]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/all', restrictTo('admin'), parcelController.getAllParcels);

/**
 * @swagger
 * /parcels/assign/{id}:
 *   patch:
 *     summary: Assign a parcel to an agent (Admin only)
 *     tags: [Parcels]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Parcel ID
 *     responses:
 *       200:
 *         description: Success
 */
router.patch('/assign/:id', restrictTo('admin'), parcelController.assignAgent);

// Agent routes
/**
 * @swagger
 * /parcels/update-status/{id}:
 *   patch:
 *     summary: Update parcel status (Agent only)
 *     tags: [Parcels]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Parcel ID
 *     responses:
 *       200:
 *         description: Success
 */
router.patch('/update-status/:id', restrictTo('agent'), parcelController.updateStatus);

// Customer routes
/**
 * @swagger
 * /parcels/my-orders:
 *   get:
 *     summary: Get all parcels for the logged-in Customer (Customer only)
 *     tags: [Parcels]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/my-orders', restrictTo('customer'), parcelController.getMyOrders);

// Agent routes
/**
 * @swagger
 * /parcels/my-tasks:
 *   get:
 *     summary: Get all parcels assigned to the logged-in Agent (Agent only)
 *     tags: [Parcels]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/my-tasks', restrictTo('agent'), parcelController.getMyTasks);

module.exports = router;