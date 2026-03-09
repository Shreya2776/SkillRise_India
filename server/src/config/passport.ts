import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      const email = profile.emails?.[0].value;

      let user = await User.findOne({ email });

      if (!user) {
        user = await User.create({
          name: profile.displayName,
          email,
          googleId: profile.id,
          role: "USER",
        });
      }

      return done(null, user);
    }
  )
);