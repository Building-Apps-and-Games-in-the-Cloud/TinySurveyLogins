import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

import { Users } from '../models/user.mjs';

import * as dotenv from 'dotenv';

dotenv.config();

class UserManager{

    constructor() {
    }

    async init()
    {
        const adminUser = await Users.findOne({ email: process.env.INITIAL_ADMIN_USERNAME });

        if (adminUser == null) {
            console.log(`  Admin user not registered`);
            const hashedPassword = await bcrypt.hash(process.env.INITIAL_ADMIN_PASSWORD, 10);
            const user = new Users(
                {
                    name: process.env.INITIAL_ADMIN_USERNAME,
                    password: hashedPassword,
                    role: 'admin',
                    email: process.env.INITIAL_ADMIN_USERNAME
                });
            await user.save();
            console.log("  Admin user successfully registered");
        }
    }
}

export { UserManager as UserManager };
