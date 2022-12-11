
import express from 'express';
import {Users}  from '../models/user.mjs';
import bcrypt from 'bcrypt';
import { messageDisplay } from '../helpers/messageDisplay.mjs';
import { checkSurveys } from '../helpers/checkstorage.mjs';

const router = express.Router();

router.get('/', (request, res) => {
    res.render('register.ejs')
});

router.post('/', checkSurveys, async (request, response) => {
    console.log("Doing the register..");
    try {
        // first find the user
        const existingUser = await Users.findOne({ email: request.body.email });

        if (existingUser) {
            messageDisplay("Register failed", `User ${request.body.email} already exists`, response);
            return;
        }
        else {
            try {
                const hashedPassword = await bcrypt.hash(request.body.password, 10);
                const user = new Users(
                    {
                        name: request.body.name,
                        password: hashedPassword,
                        role: 'user',
                        email: request.body.email
                    });
                await user.save();
                console.log("User successfully registered:", request.body.email);
                messageDisplay("Register OK", `User ${request.body.email} created`,response);
            } catch (err) {
                console.log("err:", err.message);
                messageDisplay("Register failed", `Please contact support`,response);
            }
        }
    }
    catch (err) {
        console.log(err.message);
        messageDisplay("Register failed", `Please contact support`,response);
        return;
    }
})

export { router as register };
