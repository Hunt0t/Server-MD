/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import session from 'express-session';
import http from 'http';
import cookieParser from 'cookie-parser';
import { databaseConnecting } from './app/config/database.config';
import { authenticator } from 'otplib';
import qrcode from 'qrcode';
import config from './app/config';
import path from 'path';
import notFound from './app/middlewares/notFound';
import globalErrorHandler from './app/middlewares/globalErrorhandler';
import router from './app/routes';

const app: Application = express();
const server = http.createServer(app);

app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

const generateSecret = () => authenticator.generateSecret();
const generateOTP = (secret: string) => authenticator.generate(secret);
const verifyOPT = (secret: string, token: string) =>
  authenticator.verify({ secret, token });

// Generate QR code for authenticator app setup
const generateQRCode = async (secret: string) => {
  const otpauthURL = authenticator.keyuri(
    'cpomar121@gmail.com',
    'MyApp',
    secret,
  );
  try {
    const qrImage = await qrcode.toDataURL(otpauthURL);
    return qrImage;
  } catch (error) {
    console.error('Error generating QR code:', error);
    return null;
  }
};

const corsOptions = {
  origin: async (origin: any, callback: any) => {
    try {
      callback(null, true);
      // const allowed = await checkOrigin(origin);
      // if (allowed) {
      //   callback(null, true);
      // } else {
      //   callback(new Error('Not allowed by CORS'));
      // }
    } catch (error) {
      callback(error);
    }
  },
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'superAuth',
  ],
  credentials: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
};

app.use(
  session({
    secret: config.jwt_access_secret as string,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
  }),
);

app.use(cors(corsOptions));

app.set('trust proxy', true);

app.use(cookieParser());

databaseConnecting();

const startServer = (req: Request, res: Response) => {
  try {
    res.send(`${config.wel_come_message}`);
  } catch (error) {
    console.log('server not start');
  }
};
app.get('/', startServer);

app.use(
  session({
    secret: 'secretKey',
    resave: false,
    saveUninitialized: true,
  }),
);

// Dummy user DB (replace with real DB in production)
const users: Record<string, { email: string; secret?: string }> = {
  'cpomar121@gmail.com': { email: 'cpomar121@gmail.com' },
};

// Route: Generate QR code and secret for a user
// app.get("/api/v1/qr-code", async (req, res) => {
//   const email = req.query.email as string || "cpomar121@gmail.com";
//   let user = users[email];
//   if (!user) {
//     user = { email };
//     users[email] = user;
//   }
//   // Generate and save secret if not exists
//   if (!user.secret) {
//     user.secret = generateSecret();
//   }
//   const qrCode = await generateQRCode(user.secret);
//   res.render("index", { secret: user.secret, qrCode });
// });

// Route: Verify OTP for a user
// app.post("/api/v1/verify", (req, res) => {
//   const {  token } = req.body;
//   const secret = 'OYXT46IXGQUTOPI6'
//   console.log(req.body)
//   const isValid = verifyOPT(secret , token);
//   console.log(isValid)
//   // return isValid
//   res.render("result", { isValid });
//   return isValid
// });

// app.get("/api/v1/enable-2fa", async (req, res) => {
//   const _id = req?.user?.id;
//   const user = users[_id as string];
//   if (!user) return res.status(404).json({ message: "User not found" });

//   const secret = authenticator.generateSecret();
//   user.secret = secret;

//   const otpauthURL = authenticator.keyuri(user.email, "MyApp", secret);
//   const qrCode = await qrcode.toDataURL(otpauthURL);

//   res.render("enable-2fa", { qrCode, secret });
// });

app.post('api/v1/verify-2fa', (req, res) => {
  const { email, token } = req.body;
  const user = users[email] as any;
  if (!user || !user.secret)
    return res.status(400).json({ message: 'User not found' });

  const isValid = authenticator.verify({ secret: user.secret, token });
  if (isValid) {
    user.is2FAEnabled = true;
    return res.json({ success: true, message: '2FA enabled!' });
  }
  return res.json({ success: false, message: 'Invalid code' });
});

app.use('/api/v1', router);

// Importing routes
app.use(notFound);
app.use(globalErrorHandler);

server.listen(config.port, () => {
  console.log(`Local         :👉 http://localhost:${config.port}/`);
});
