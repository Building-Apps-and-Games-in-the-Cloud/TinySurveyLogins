
import express from 'express';
import { SurveyUsers } from '../models/user.mjs';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { checkSurveys } from '../helpers/checkstorage.mjs';
import { messageDisplay } from '../helpers/messageDisplay.mjs';

const jwtExpirySeconds = 30;

const router = express.Router();

router.get('/', checkSurveys, (request, response) => {
    response.render('login.ejs')
});

router.post('/', checkSurveys, async (request, response) => {
    try {
        // first find the user
        const user = await SurveyUsers.findOne({ email: request.body.email });

        if (user) {
            // we have the user - now check the password
            const validPassword = await bcrypt.compare(request.body.password, user.password);
            if (validPassword) {
                // now make the jwt token to send back to the browser
                const accessToken = jwt.sign(
                    { id: user._id },
                    process.env.ACTIVE_TOKEN_SECRET,
                    {
                        algorithm: "HS256",
                        expiresIn: jwtExpirySeconds,
                    });

                response.cookie("token", accessToken, { maxAge: jwtExpirySeconds * 1000 });
                response.redirect('/index.html');
            }
            else {
                messageDisplay("Login failed", "Invalid user or password", response);
            }
        }
        else {
            messageDisplay("Login failed", "Invalid user or password", response);
        }
    }
    catch (err) {
        messageDisplay("Login failed", `Please contact support`, response);
        return;
    }
})

export { router as login };
