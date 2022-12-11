import mongoose from "mongoose";

const surveyUserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        role: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        completedSurveys:{
            type: [String],
            default: []
        }
    });

let Users = mongoose.model('surveyusers', surveyUserSchema);
    
export { Users as Users };
    
