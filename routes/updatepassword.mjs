import express from 'express';
import { SurveyUsers } from '../models/user.mjs';
import bcrypt from 'bcrypt';
import { messageDisplay } from '../helpers/messageDisplay.mjs';
import { checkSurveys } from '../helpers/checkstorage.mjs';
import { authenticateToken } from '../helpers/authenticateToken.mjs';

const router = express.Router();

router.post('/', checkSurveys, authenticateToken, async (request, response) => {
    console.log("Updating a password.");

    if (response.user.role == "admin") {

        try {
            // first find the user
            const user = await SurveyUsers.findOne({ email: request.body.email });

            if (user) {
                try {
                    const hashedPassword = await bcrypt.hash(request.body.password, 10);
                    user.password = hashedPassword;
                    await user.save();
                    messageDisplay("Updated OK", `User ${request.body.email} updated`, response);
                } catch (err) {
                    console.log("err:", err.message);
                    messageDisplay("Update failed", `Please contact support`, response);
                }
            }
            else {
                messageDisplay("Update failed", `User ${request.body.email} not found`, response);
            }
        }
        catch (err) {
            messageDisplay("Update failed", `Please contact support`, response);
            return;
        }
    }
    else {
        messageDisplay("Update failed", `User not admin`, response);
    }
})

export { router as updatepassword };
