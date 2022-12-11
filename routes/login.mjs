
import express from 'express';
import {Users}  from '../models/user.mjs';
import bcrypt from 'bcrypt';
import  jwt from 'jsonwebtoken';
import { checkSurveys } from '../helpers/checkstorage.mjs';

const jwtExpirySeconds = 30;

const router = express.Router();

router.get('/', checkSurveys, (request, response) => {
    response.render('login.ejs')
});

router.post('/',  checkSurveys, async (request, response) => {
    console.log("Doing the login..");
    try {
        // first find the user
        const existingUser = await Users.findOne({ email: request.body.email });

        if (existingUser == null) {
            console.log("Login fail no user registered for:", request.body.email);
            response.redirect('/');
            return;
        }
        else {
            // we have the user - now check the password
            const validPassword = await bcrypt.compare(request.body.password, existingUser.password);
            if (validPassword) {
                console.log("Got a valid password");
                // now make the jwt token to send back to the browser
                console.log("user:", existingUser.id, existingUser._id, existingUser.role);
                let userDetails = {
                    id: existingUser.id
                }
                const accessToken = jwt.sign(
                    userDetails, 
                    process.env.ACTIVE_TOKEN_SECRET,
                    {
                        algorithm: "HS256",
                        expiresIn: jwtExpirySeconds,
                    });

                console.log(`Made a token:${accessToken}`);
                
                response.cookie("token", accessToken, { maxAge: jwtExpirySeconds * 1000 });
                response.render('index.ejs',{ name: existingUser.name});
                console.log("Sucessful login for:", request.body.email);
                return;
            }
            else {
                console.log("Login fail invalid password");
                response.redirect('/');
                return;
            }
        }
    }
    catch (err) {
        console.log(err.message);
        response.redirect('/index');
        return;
    }
})

export { router as login };
