import  jwt from 'jsonwebtoken';
import {Users}  from '../models/user.mjs';

const jwtExpirySeconds = 60;
const jwtRenewSeconds = 30;

async function authenticateToken(request, response, next) {

  const token = request.cookies.token;

  // if the cookie is not set, return an unauthorized error
  if (!token) {
    console.log("Token cookie not found");
    response.redirect('/login');
    return;
  }

  //console.log("Got a token:", token);

  var payload;

  try {
    // Parse the JWT string and store the result in `payload`.
    // Note that we are passing the key in this method as well. This method will throw an error
    // if the token is invalid (if it has expired according to the expiry time we set on sign in),
    // or if the signature does not match
    payload = jwt.verify(token, process.env.ACTIVE_TOKEN_SECRET);
  } catch (e) {
    console.log("jwt failed", e.message);
    response.redirect('/login');
    return;
  }

  // got the token - use the ID in the token to look up the user
  const user = await Users.findOne({ _id: payload.id });

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

  // console.log(`Token seconds left:${tokenSecondsLeft}`);
  if (tokenSecondsLeft < jwtRenewSeconds) {
    console.log("Making a new token..");
    // need to make a new token
    let userDetails = {
      id: user.id
    };

    const accessToken = jwt.sign(
      userDetails,
      process.env.ACTIVE_TOKEN_SECRET,
      {
        algorithm: "HS256",
        expiresIn: jwtExpirySeconds,
      });

    //console.log(`Made a token:${accessToken}`);
    response.cookie("token", accessToken, { maxAge: jwtExpirySeconds * 1000 });
  }
  next();
}

export { authenticateToken as authenticateToken };
