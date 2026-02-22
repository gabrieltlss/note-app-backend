import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { UserServices } from "../services/UserServices";

const userServices = new UserServices();

passport.use(
    new GoogleStrategy(
        {
            clientID: String(process.env.GOOGLE_CLIENT_ID),
            clientSecret: String(process.env.GOOGLE_CLIENT_SECRET),
            callbackURL: String(process.env.GOOGLE_REDIRECT_URI)
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                if (typeof profile.emails !== "undefined" && typeof profile.emails[0]?.value !== "undefined") {
                    const email = profile.emails[0].value;
                    let user = await userServices.getUser(email);

                    if (!user) {
                        // Acho que há erro aqui. E se user não for criado, o que getUser retorna? Arrumar!
                        await userServices.createUser(email);
                        user = await userServices.getUser(email);
                        return done(null, user);
                    }
                    return done(null, user);
                }

                return done(null, false);
            } catch (error) {
                return done(error, false);
            }
        })
);

export { passport };