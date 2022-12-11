import express from 'express';
import { checkSurveys } from '../helpers/checkstorage.mjs';
import { authenticateToken } from '../helpers/authenticateToken.mjs';

const router = express.Router();

// Home page - just render the index
router.get('/',  checkSurveys, authenticateToken, (request, response) => {

  response.render('index.ejs', { name: response.user.name});
});


export { router as index };