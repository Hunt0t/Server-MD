

import { Router } from 'express';
import { AuthRoutes } from '../modules/Auth/auth.route';
import { userRoutes } from '../modules/User/user.route';
import { productRoutes } from '../modules/products/products.route';
import { orderRoutes } from '../modules/orders/orders.route';
import { announcementRoutes } from '../modules/announcements/announcements.route';
import {paymentRoutes} from '../modules/payment/payment.route';
import { userContactRoutes } from '../modules/userContact/userContact.route';
import { paymentGatewayRoutes } from '../modules/payment.getwaye/payment.gateway.route';

const router = Router();

const moduleRoutes = [
  {
    path: '/orders',
    route: orderRoutes,
  },
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/user',
    route: userRoutes,
  },
  {
    path: '/product',
    route: productRoutes,
  },
  {
    path: '/announcement',
    route: announcementRoutes,
  },
  {
    path: '/payment',
    route: paymentRoutes,
  },
  {
    path: '/user-contact',
    route: userContactRoutes,
  },
  {
    path: '/payment-gateway',
    route: paymentGatewayRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
