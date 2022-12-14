import mongoose from 'mongoose';

import { Surveys } from '../models/survey.mjs';
import * as dotenv from 'dotenv';

dotenv.config();

class SurveyManagerDB {

    constructor() {
    }

    async init() {
        mongoose.set('strictQuery', true);
        await mongoose.connect(process.env.DATABASE_URL);
    }

    async disconnect(){
        await mongoose.disconnect();
    }

    /**
     * Stores a survey
     * @param {Object} newValue topic string, creatorGUID and option list  
     */
    async storeSurvey(newValue) {
        let survey = await Surveys.findOne({ topic: newValue.topic });
        if (survey != null) {
            await survey.updateOne(newValue);
        }
        else {
            let newSurvey = new Surveys(newValue);
            await newSurvey.save();
        }
    }

    /**
     * Delete the survey with the given topic
     * @param {string} topic topic of the survey 
     */
    async deleteSurvey(topic){
        await Surveys.deleteOne(({ topic: topic }));
    }


    /**
     * Clear the survey with the given topic
     * @param {string} topic topic of the survey 
     */
    async resetsurvey(topic){
        let survey = await Surveys.findOne({ topic: topic });
        survey.options.forEach(option => {
            option.count = 0;
        });
        await survey.save();
    }


    /**
     * Increment the count for an option in a topic
     * @param {Object} incDetails topic and option names
     */
    async incrementCount(incDetails) {
        let survey = await Surveys.findOne({ topic: incDetails.topic });
        let option = survey.options.find(
            item => item.text == incDetails.option);
        if (option != undefined) {
            option.count = option.count + 1;
        }

        await survey.save();
    }

    async surveyExists(topic) {
        let survey = await Surveys.findOne({ topic: topic });
        return survey != null;
    }

    /**
     * 
     * @param {string} topic of the survey
     * @returns topic, creatorGUID and a list of option names and counts
     */
    async getCounts(topic) {
        let result;
        let survey = await Surveys.findOne({ topic: topic });
        if (survey != null) {
            let options = [];
            survey.options.forEach(option => {
                let countInfo = { text: option.text, count: option.count };
                options.push(countInfo);
            });
            result = { topic: survey.topic, 
                options: options,
                creatorGUID: survey.creatorGUID };
        }
        else {
            result = null;
        }
        return result;
    }

    /**
     * 
     * @param {string} topic topic of the survey 
     * @returns topic, creatorGUID and a list of option names 
     */
    async getOptions(topic) {
        let result;
        let survey = await Surveys.findOne({ topic: topic });
        if (survey != null) {
            let options = [];
            survey.options.forEach(option => {
                let optionInfo = { text: option.text };
                options.push(optionInfo);
            });
            let result = { topic: survey.topic, 
                options: options,
                creatorGUID: survey.creatorGUID };
            return result;
        }
        else {
            result = null;
        }
        return result;
    }
}

export { SurveyManagerDB as SurveyManager };

