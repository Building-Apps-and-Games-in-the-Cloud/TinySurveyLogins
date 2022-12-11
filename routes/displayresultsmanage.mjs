import express from 'express';
import { surveyManager } from '../tinysurvey.mjs';
import { checkSurveys } from '../helpers/checkstorage.mjs';
import { authenticateToken } from '../helpers/authenticateToken.mjs';

const router = express.Router();

router.get('/:topic', checkSurveys, authenticateToken, async (request, response) => {
  let topic = request.params.topic;
  if (! await surveyManager.surveyExists(topic)) {
    response.status(404).send('<h1>Survey not found</h1>');
  }
  else {
    let results = await surveyManager.getCounts(topic);
    response.render('displayresultsmanage.ejs', results);
  }
});


export { router as displayresultsmanage };