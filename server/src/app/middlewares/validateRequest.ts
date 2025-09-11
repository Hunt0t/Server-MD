
import { AnyZodObject } from 'zod';
import catchAsync from '../utils/catchAsync';

const validateRequest = (schema: AnyZodObject) => {
  return catchAsync(async (req : any, res, next) => {
    if (req.user && req?.user?.id) {
      req.body.user = req.body.user || req.user.id; 
      req.body.admin = req.body.admin || req.user.id; 
    }
    await schema.parseAsync({
      body: req.body,
      cookies: req.cookies,
    });

    next();
  });
};

export default validateRequest;


