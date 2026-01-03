import express from 'express';
import {
  loginUser,
  registerUser,
  adminLogin,
  getProfile,
  updateProfile,
  addAddress,
  updateAddress,
  deleteAddress,
  deleteAccount,
  sendPasswordOtp,
  changePasswordWithOtp,
  exportUserData
} from '../controllers/userController.js';
import authUser from '../middleware/auth.js';
import upload from '../middleware/multer.js';
import { sendCustomDesign } from '../controllers/userController.js';

const userRouter = express.Router();

// Public
userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/admin', adminLogin);

// Protected (requires auth middleware)
userRouter.get('/profile', authUser, getProfile);
userRouter.put('/update', authUser, updateProfile);

// Address management
userRouter.post('/address/add', authUser, addAddress);
userRouter.put('/address/update', authUser, updateAddress);
userRouter.post('/address/delete', authUser, deleteAddress);
userRouter.post('/send-password-otp', sendPasswordOtp);
userRouter.post('/change-password', changePasswordWithOtp);

// export user data (download)
userRouter.get('/export', authUser, exportUserData);

userRouter.post('/custom-design', upload.array('files', 6), sendCustomDesign);

// Account removal
userRouter.delete('/delete', authUser, deleteAccount);

export default userRouter;
