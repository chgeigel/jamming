/**
 * This is an example of a basic node.js script that performs
 * the Implicit Grant oAuth2 flow to authenticate against
 * the Spotify Accounts.
 *
 * For more information, read
 * https://developer.spotify.com/web-api/authorization-guide/#implicit_grant_flow
 */

var express = require('express'); // Express web server framework
const cors = require('cors');
require('dotenv').config();

var port = process.env.REACT_APP_SPOTIFY_LOGIN_PORT || 8888;

var app = express();
app.use(cors());
app.options('*',cors());
app.use(express.static(__dirname + '/server_public'));
app.listen(port, ()=>console.log(`Listening on ${port}`));
