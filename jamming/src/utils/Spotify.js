const CORS_URL='https://cors-anywhere.herokuapp.com/';
const SPOTIFY_AUTH_API_URL = 'https://accounts.spotify.com/authorize';
const SPOTIFY_API_URL = 'https://api.spotify.com/v1/';

var userId = 'schadwe';
var oauthToken = '';
var clientId = process.env.SPOTIFY_CLIENT_ID;
var redirectURI = 'http://localhost:3000/callback';
var scope = 'user-read-private user-read-email playlist-modify-public playlist-modify-private';
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
        return this.getToken();

      } else {

        const url = CORS_URL +
                    SPOTIFY_API_URL + 'search?' +
                    'q='+encodeURIComponent(term) +
                    '&type='+encodeURIComponent(searchType);
        return fetch(url,{
          method: 'GET',
//        mode: 'no-cors',
          headers: {
            'Authorization': `Bearer ${oauthToken}`
          }
        }).then(response => {
        if ( response.ok ) {
          return response.json();
        }
        alert('Failed to search Spotify.');
        }, networkError => console.log(networkError.message)
        ).then(jsonResponse => {
    //        console.log(JSON.stringify(jsonResponse, undefined, 2));
          const tracks = [];
          if ( typeof jsonResponse != 'undefined' && jsonResponse.tracks ) {
            jsonResponse.tracks.items.forEach(item => {
              const track = {};
              track.uri = item.uri;
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
  },

  createPlayList(name) {
      if ( oauthToken === '' ) {
        this.getToken();

      } else {

        const url = CORS_URL +
                    SPOTIFY_API_URL +
                    'users/' + userId + '/playlists';
        const body = {
          name: name,
          description: '',
          public: false
        }

        return fetch(url,{
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${oauthToken}`
          },
          body: JSON.stringify(body)
        }).then(response => {
          if ( response.ok ) {
            return response.json();
          }
          alert('Failure creating playlist.');
        }, networkError => console.log(networkError.message)
        ).then(jsonResponse => {
//            console.log(JSON.stringify(jsonResponse, undefined, 2));
            if ( typeof jsonResponse != 'undefined' && jsonResponse.uri && jsonResponse.id) {
              return {uri: jsonResponse.uri, id: jsonResponse.id};
            }
            return {uri: '', id: ''};
        });
      }
  },

  addTracksToPlayList(playListId, uris) {
      if ( oauthToken === '' ) {
        this.getToken();

      } else {

        const url = CORS_URL +
                    SPOTIFY_API_URL +
                    'playlists/' +
                    playListId +
                    '/tracks';
        const body = {
          uris: uris,
          position: 0
        }

        return fetch(url,{
          method: 'POST',
          headers: {
            'Content-type': 'application/json',
            'Authorization': `Bearer ${oauthToken}`
          },
          body: JSON.stringify(body)
        }).then(response => {
          if ( response.ok ) {
            return response.json();
          }
          alert('Failure adding tracks to playlist.');
        }, networkError => console.log(networkError.message)
        ).then(jsonResponse => {
//            console.log(JSON.stringify(jsonResponse, undefined, 2));
            if ( typeof jsonResponse != 'undefined' && jsonResponse.snapshot_id) {
              return jsonResponse.snapshot_id;
            }
            return '';
        });
      }
  }

}
