/**
 * This is an example of a basic node.js script that performs
 * the Implicit Grant oAuth2 flow to authenticate against
 * the Spotify Accounts.
 *
 * For more information, read
 * https://developer.spotify.com/web-api/authorization-guide/#implicit_grant_flow
 */

var express = require('express'); // Express web server framework
var cors = require('cors');
var dotenv = require('dotenv').config({path: '../.env'});

if ( dotenv.error) {
  throw dotenv.error;
}
var port = process.env.REACT_APP_SPOTIFY_LOGIN_PORT || 5000;
var client_id = process.env.REACT_APP_SPOTIFY_CLIENT_ID; // Your client id
var redirect_uri = process.env.REACT_APP_SPOTIFY_REDIRECT_URL; // Your redirect uri
var url = process.env.REACT_APP_SPOTIFY_AUTH_API_URL;


var app = express();
app.use(cors());
app.options('*',cors());
//app.use(express.static(__dirname + '/server_public'));

function generateRandomString(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

app.get('/', function(req,res) {
  console.log('here');
  var stateKey = 'spotify_auth_state';
  /**
   * Generates a random string containing numbers and letters
   * @param  {number} length The length of the string
   * @return {string} The generated string
   */


  var state = generateRandomString(16);

  var scope = 'user-read-private user-read-email playlist-modify-public playlist-modify-private';
  var parameters = '?response_type=token' +
                   '&client_id=' + encodeURIComponent(client_id) +
                   '&scope=' + encodeURIComponent(scope) +
                   '&redirect_uri=' + encodeURIComponent(redirect_uri) +
                   '&state=' + encodeURIComponent(state);

  //window.location = url;
  console.log(url + parameters);
  res.redirect(url + parameters);

});

app.listen(port, ()=>console.log(`Listening on ${port}`));
