const express = require('express');
const user = require('../controllers/user');
const auth = require('../controllers/auth');
const router = express.Router();

router.post('/signup', auth.signUp);
router.post('/login', auth.login);
router.post('/forgotPassword', auth.forgotPassword);
router.post('/resetPassword/:token', auth.resetPassword);

router.use(auth.requireLogin); // Protect all next routes

router.route('/').get(user.getQuery);
router.get('/getMyAccount', user.setUserId, user.getOne);
router.post('/updateMyPassword', auth.updateMyPassword);
router.patch('/updateMyAccount', user.updateMyAccount);
router.delete('/deleteMyAccount', user.deleteMyAccount);
router
  .route('/:id')
  .get(user.getOne)
  .patch(auth.restrictToAdmin, user.updateById);

module.exports = router;
