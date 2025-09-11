

import express from 'express';
import { productControllers } from './products.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../Auth/auth.schema';
import { upload } from '../../utils/sendImageToCloudinary';

const router = express.Router();

// Create a new user
// This route is typically used for admin to create users
// or for user registration
router.post(
  '/create-product',
  auth(USER_ROLE.ADMIN),
  productControllers.createProduct,
);

// Update a product
router.patch(
  '/:id',
  auth(USER_ROLE.ADMIN),
  productControllers.updateProduct,
);

// Delete a product
router.delete(
  '/:id',
  auth(USER_ROLE.ADMIN),
  productControllers.deleteProduct,
);

// Delete all products by fileName
router.delete(
  '/delete-by-file/:fileName',
  auth(USER_ROLE.ADMIN),
  productControllers.deleteProductsByFileName,
);

// Export products (selected or all)
router.get(
  '/export',
  auth(USER_ROLE.ADMIN, USER_ROLE.USER),
  productControllers.exportProducts,
);

// Get all users
router.get(
  '/products',
  auth(USER_ROLE.ADMIN, USER_ROLE.USER),
  productControllers.getProducts,
);

// Import orders from JSON file
router.post(
  '/import-json',
  auth(USER_ROLE.ADMIN, USER_ROLE.USER),
  upload.single('file'),
  (req, res, next) => {
    console.log(req.body)
    next();
  },
  productControllers.importOrdersFromJson,
);

// Import orders from CSV file
router.post(
  '/import-csv',
  auth(USER_ROLE.ADMIN, USER_ROLE.USER),
  upload.single('file'),
  (req, res, next) => {
    // req.body = JSON.parse(req.body.data);
    next();
  },
  productControllers.importOrdersFromCsv,
);

// Get unique states
router.get(
  '/unique-states',
  auth(USER_ROLE.ADMIN, USER_ROLE.USER),
  productControllers.getUniqueStates,
);

// Get unique file names
router.get(
  '/unique-file-name',
  auth(USER_ROLE.ADMIN, USER_ROLE.USER),
  productControllers.getUniqueFileNames,
);

// Delete all products by fileName
router.delete(
  '/delete-by-file/:fileName',
  auth(USER_ROLE.ADMIN),
  productControllers.deleteProductsByFileName,
);


export const productRoutes = router;
