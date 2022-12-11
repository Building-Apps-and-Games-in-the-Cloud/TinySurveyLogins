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
            const existingUser = await SurveyUsers.findOne({ email: request.body.email });

            if (!existingUser) {
                messageDisplay("Update failed", `User ${request.body.email} not found`, response);
                return;
            }
            else {
                try {
                    const hashedPassword = await bcrypt.hash(request.body.password, 10);
                    existingUser.password = hashedPassword;
                    await existingUser.save();
                    console.log("User successfully updated:", request.body.email);
                    messageDisplay("Updated OK", `User ${request.body.email} updated`, response);
                } catch (err) {
                    console.log("err:", err.message);
                    messageDisplay("Update failed", `Please contact support`, response);
                }
            }
        }
        catch (err) {
            console.log(err.message);
            messageDisplay("Update failed", `Please contact support`, response);
            return;
        }
    }
    else {
        messageDisplay("Update failed", `User not admin`, response);
    }
})

export { router as updatepassword };
