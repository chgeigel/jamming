const CORS_URL='https://cors-anywhere.herokuapp.com/';
const SPOTIFY_AUTH_API_URL = 'https://accounts.spotify.com/authorize'
const SPOTIFY_SEARCH_API_URL = 'https://api.spotify.com/v1/search';
var oauthToken = 'BQAapmfvkAY5qByetJn2ZDA4_nIBVWvSvf3Hdj036uq330LzNh7T7FNW6R8rP3ifivTfB0-_VlWOMxpUQEoF8NNrI2IRXse1yr3vpuWhQJe4jdfcHClFIflCjwRNV49oNknjP1VpeJFmpFOTklfBFeUi65wR';
var clientId = process.env.SPOTIFY_CLIENT_ID;
var redirectURI = 'http://localhost:3000/callback';
var scope = 'user-read-private user-read-email';
var responseType = 'token';
var searchType = 'track'; /* track, artist, ablum */

var generateRandomString = function(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

export const Spotify = {

  getToken() {
    if ( oauthToken !== '' ) {
      return oauthToken;
    }

    const state = generateRandomString(16);

    const url = CORS_URL +
                SPOTIFY_AUTH_API_URL + '?' +
                'client_id='+encodeURIComponent(clientId)+
                '&redirect_uri='+encodeURIComponent(redirectURI)+
                '&scope='+encodeURIComponent(scope)+
                '&response_type='+encodeURIComponent(responseType)+
                '&state='+encodeURIComponent(state);
    console.log(`Trying to log in using ${url}`);
    fetch(url, {
        method: 'GET',
//        mode: 'no-cors',
        redirect: 'follow',
      }).then(response => {
        console.log('in response');
      }, networkError => {
        console.log(networkError);
      });

    return oauthToken;
  },

  search(term) {
      if ( oauthToken === '' ) {
        this.getToken();

      } else {
        return fetch(`${CORS_URL}${SPOTIFY_SEARCH_API_URL}?q=${term}&type=${searchType}`,{
          headers: {
            'Authorization': `Bearer ${oauthToken}`
          }
        }).then(response => {
        if ( response.ok ) {
          return response.json();
        }
        throw new Error('Request failed');
        }, networkError => console.log(networkError.message)
        ).then(jsonResponse => {
    //        console.log(JSON.stringify(jsonResponse, undefined, 2));
          const tracks = [];
          if ( jsonResponse.tracks ) {
            jsonResponse.tracks.items.forEach(item => {
              const track = {};
              track.id = item.id;
              track.name = item.name;
              track.artists = [];
              item.artists.forEach(artist => {
                track.artists.push(artist.name);
              });
              track.album = item.album.name;
              tracks.push(track);
            });
//            console.log(JSON.stringify(tracks));
            return tracks;
          }
        });
      }
  }
}
