// const passport = require('passport'),
//   LocalStrategy = require('passport-local').Strategy,
//   passportJWT = require('passport-jwt');
//   UserModel = require('./models/user');

// let Users = UserModel
//   JWTStrategy = passportJWT.Strategy,
//   ExtractJWT = passportJWT.ExtractJwt;

// passport.use(
//   new LocalStrategy(
//     {
//       emailField: 'email',
//       passwordField: 'password',
//     },
//     (email, password, callback) => {
//       console.log(email + '  ' + password);
//       Users.findOne({ email: email }, (error, user) => {
//         if (error) {
//           console.log(error);
//           return callback(error);
//         }

//         if (!user) {
//           console.log('incorrect email');
//           return callback(null, false, {
//             message: 'Incorrect email or password.',
//           });
//         }

//         if (!user.validatePassword(password)) {
//           console.log('incorrect password');
//           return callback(null, false, { message: 'Incorrect password.' });
//         }

//         console.log('finished');
//         return callback(null, user);
//       });
//     }
//   )
// );

// passport.use(
//   new JWTStrategy(
//     {
//       jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
//       secretOrKey: 'your_jwt_secret',
//     },
//     (jwtPayload, callback) => {
//       return Users.findById(jwtPayload._id)
//         .then((user) => {
//           return callback(null, user);
//         })
//         .catch((error) => {
//           return callback(error);
//         });
//     }
//   )
// );
