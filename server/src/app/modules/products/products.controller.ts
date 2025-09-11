import fs from 'fs';

/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { productServices } from './products.service';
import { parse as csvParse } from 'csv-parse/sync';
import { USER_ROLE } from '../Auth/auth.schema';

// Create a new user
const createProduct = catchAsync(async (req, res) => {
  const result = await productServices.createProduct(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: `Product created`,
    data: result,
  });
});


const getProducts = catchAsync(async (req: any, res) => {
  if (req?.user?.role === USER_ROLE.ADMIN) {
    const result = await productServices.getProductsForAdmin(req as any);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'All product have been successfully loaded.',
      meta: result.meta,
      data: result.data,
    });
  } else {
    const result = await productServices.getProducts(req as any);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'All product have been successfully loaded.',
      meta: result.meta,
      data: result.data,
    });
  }
});

// Update a product
const updateProduct = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await productServices.updateProduct(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product updated',
    data: result,
  });
});

// Delete a product
const deleteProduct = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await productServices.deleteProduct(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product deleted',
    data: result,
  });
});


const exportProducts = catchAsync(async (req, res) => {
  console.log('req.query.ids', req.query.ids)
  const ids = req.query.ids ? (req.query.ids as string).split(',') : undefined;
  const csv = await productServices.exportProducts(ids);
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="products.csv"');
  res.status(httpStatus.OK).send(csv);
});

// Import orders from JSON file
const importOrdersFromJson = catchAsync(async (req, res) => {
  if (!req.file) {
    return sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: 'No file uploaded',
      data: null,
    });
  }
  let orders;
  try {
    // orders = JSON.parse(req.file.buffer.toString());

    const fileContent = fs.readFileSync(req.file.path, 'utf-8');
    orders = JSON.parse(fileContent);

    if (!Array.isArray(orders)) throw new Error('JSON must be an array');
  } catch (e) {
    return sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: 'Invalid JSON file',
      data: null,
    });
  }
  const result = await productServices.bulkImportOrders(orders, req);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Orders imported from JSON',
    data: result,
  });
});

// Import orders from CSV file
const importOrdersFromCsv = catchAsync(async (req, res) => {
  console.log('req.body', req.body.price)
  if (!req.file) {
    return sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: 'No file uploaded',
      data: null,
    });
  }
  let records;
  try {
    const fileContent = fs.readFileSync(req.file.path, 'utf-8');
    records = csvParse(fileContent, {
      columns: true,
      skip_empty_lines: true,
    });
    
  } catch (e) {
    
    return sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: 'Invalid CSV file',
      data: null,
    });
  }
  const result = await productServices.bulkImportOrders(records, req);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Orders imported from CSV',
    data: result,
  });
});

// Get unique states using aggregation
const getUniqueStates = catchAsync(async (req, res) => {
  const states = await productServices.getUniqueStates();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Unique states loaded successfully.',
    data: states,
  });
});

// Get unique states using aggregation
const getUniqueFileNames = catchAsync(async (req, res) => {
  const states = await productServices.getUniqueFileNames();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Unique file loaded successfully.',
    data: states,
  });
});
// Delete all products by fileName
const deleteProductsByFileName = catchAsync(async (req, res) => {
  const { fileName } = req.params;
  if (!fileName) {
    return sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: 'fileName is required',
      data: null,
    });
  }
  const result = await productServices.deleteProductsByFileName(fileName);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `All products with fileName '${fileName}' deleted`,
    data: result,
  });
});


export const productControllers = {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  exportProducts,
  importOrdersFromJson,
  importOrdersFromCsv,
  getUniqueStates,
  getUniqueFileNames
  ,deleteProductsByFileName
};
