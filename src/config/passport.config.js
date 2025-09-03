import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import User from '../models/User.js';

const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies['jwtCookieToken'];
  }
  return token;
};

const jwtOptions = {
  jwtFromRequest: cookieExtractor,
  secretOrKey: 'tu_secreto_para_jwt',
};

passport.use('jwt', new JwtStrategy(jwtOptions, async (jwt_payload, done) => {
  try {
    const user = await User.findById(jwt_payload.user._id).lean();
    if (user) {
      return done(null, user);
    } else {
      return done(null, false, { message: 'Usuario no encontrado' });
    }
  } catch (error) {
    return done(error, false);
  }
}));

export default passport;