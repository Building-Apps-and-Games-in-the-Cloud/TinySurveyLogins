import express from 'express';
import {SurveyUsers}  from '../models/user.mjs';
import bcrypt from 'bcrypt';
import { messageDisplay } from '../helpers/messageDisplay.mjs';
import { checkSurveys } from '../helpers/checkstorage.mjs';

const router = express.Router();

router.get('/', (request, res) => {
    res.render('register.ejs')
});

router.post('/', checkSurveys, async (request, response) => {
    try {
        // first try to find the user
        const existingUser = await SurveyUsers.findOne({ email: request.body.email });

        if (existingUser) {
            messageDisplay("Register failed", `User ${request.body.email} already exists`, response);
        }
        else {
                const hashedPassword = await bcrypt.hash(request.body.password, 10);
                const user = new SurveyUsers(
                    {
                        name: request.body.name,
                        password: hashedPassword,
                        role: 'user',
                        email: request.body.email
                    });
                await user.save();
                messageDisplay("Register OK", `User ${request.body.email} created`,response);
        }
    }
    catch (err) {
        messageDisplay("Register failed", `Please contact support`,response);
        return;
    }
})

export { router as register };
