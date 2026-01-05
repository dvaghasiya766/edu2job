import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "../models/userModel.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, cb) => {
      try {
        let user = await User.findOne({ googleID: profile.id });
        
        if (!user) {
          // Check if user exists with same email
          user = await User.findOne({ email: profile.emails[0].value });
          
          if (user) {
            // Update existing user with Google ID
            user.googleID = profile.id;
            user.isVerified = true;
            user.status = 'active';
            user.isLoggedIn = true;
            await user.save();
          } else {
            // Create new user
            user = await User.create({
              googleID: profile.id,
              name: profile.displayName,
              email: profile.emails[0].value,
              password: 'google-oauth',
              isVerified: true,
              status: 'active',
              isLoggedIn: true
            });
          }
        } else {
          user.isLoggedIn = true;
          await user.save();
        }

        return cb(null, user);
      } catch (error) {
        return cb(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});
