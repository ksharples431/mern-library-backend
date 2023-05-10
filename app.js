const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
const dotenv = require('dotenv');

const HttpError = require('./models/http-error');

const bookRoutes = require('./routes/book-routes');
const userRoutes = require('./routes/user-routes');
const authRoutes = require('./routes/auth-routes');
const libraryRoutes = require('./routes/library-routes');

// Initialize express
const app = express();

// Enviroment variables
dotenv.config();

// Body parser
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// Cors middleware
let allowedOrigins = ['http://localhost:1234'];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        let message =
          'The CORS policy for this application doesn’t allow access from origin ' +
          origin;
        return callback(new Error(message), false);
      }
      return callback(null, true);
    },
  })
);
// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', 'http://localhost:1234');
//   res.setHeader('Allow-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
//   res.setHeader('Allow-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
//   next();
// })
// Allow all origins
// app.use(cors());

// Auth
// let auth = require('./controllers/auth-controller');
// auth.loginUser(app)
// const passport = require('passport');
// require('./passport');

// Logger middleware
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'log.txt'),
  { flags: 'a' }
);
app.use(morgan('combined', { stream: accessLogStream }));

// Serve static files
app.use(express.static('public'));

// Routes
app.use('/api/books', bookRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/library', libraryRoutes);

// Error handling
app.use((req, res, next) => {
  const error = new HttpError('Could not find this route.', 404);
  throw error;
});
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
// Max
app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || 'An unknown error occured!' });
});

// Database
mongoose.set('strictQuery', false);
mongoose.connect(process.env.CONNECTION_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
// mongoose.set('strictQuery', true);

// Listen for requests
const port = process.env.PORT || 5000;
app.listen(port, '0.0.0.0', () => {
  console.log('Listening on Port ' + port);
});
