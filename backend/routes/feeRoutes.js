const router = express.Router();
const { createFee, getFees, updateFeeStatus } = require('../controllers/feeController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, authorize('admin', 'student', 'parent'), getFees)
    .post(protect, authorize('admin'), createFee);

router.put('/:id/pay', protect, authorize('admin'), updateFeeStatus);
router.post('/:id/pay-online', protect, authorize('student', 'parent'), require('../controllers/feeController').payFee);

module.exports = router;
