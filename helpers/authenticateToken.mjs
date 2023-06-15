import jwt from 'jsonwebtoken';
import { SurveyUsers } from '../models/user.mjs';

const jwtExpirySeconds = 30;
const jwtRenewSeconds = 10;

async function authenticateToken(request, response, next) {

  const token = request.cookies.token;

  // if the cookie is not set go to the login page
  if (!token) {
    response.redirect('/login');
    return;
  }

  let payload;

  try {
    payload = jwt.verify(token, process.env.ACTIVE_TOKEN_SECRET);
  } catch (e) {
    response.redirect('/login');
    return;
  }

  // got the token - use the ID in the token to look up the user
  const user = await SurveyUsers.findOne({ _id: payload.id });

  if (user === null) {
    console.log("User not found");
    response.redirect('/login');
    return;
  }

  response.user = user;

  // now handle refresh - see how much time we have left
  // on this token...

  const nowUnixSeconds = Math.round(Number(new Date()) / 1000);

  const tokenSecondsLeft = payload.exp - nowUnixSeconds;

  if (tokenSecondsLeft < jwtRenewSeconds) {
    // need to make a new token
    const accessToken = jwt.sign(
      { id: user.id },
      process.env.ACTIVE_TOKEN_SECRET,
      {
        algorithm: "HS256",
        expiresIn: jwtExpirySeconds,
      });

    response.cookie("token", accessToken, { maxAge: jwtExpirySeconds * 1000 });
  }
  next();
}

export { authenticateToken as authenticateToken };
