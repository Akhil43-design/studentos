const express = require('express');
const router = express.Router();
const drawingController = require('../controllers/drawingController');
const { authenticateToken } = require('../middleware/auth');

router.use(authenticateToken);

router.get('/', drawingController.getDrawings);
router.get('/:id', drawingController.getDrawingById);
router.post('/', drawingController.createDrawing);
router.put('/:id', drawingController.updateDrawing);
router.delete('/:id', drawingController.deleteDrawing);

module.exports = router;
