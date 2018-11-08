const queryString=require('query-string');

var userId = '';
var oauthToken = '';

var searchType = 'track'; /* track, artist, ablum */

export const Spotify = {

  getToken() {
    const currentURL = window.location.hash;
//    console.log(`current url is ${currentURL}`);
    const parsed = queryString.parse(currentURL);
//    console.log(parsed);
    if ( parsed.access_token ) {
      oauthToken = parsed.access_token;
    }
    if ( oauthToken === '' ) {
//      console.log(`Doing a GET of ${process.env.REACT_APP_SPOTIFY_LOGIN_URL}`);
      window.location = process.env.REACT_APP_SPOTIFY_LOGIN_URL;
    }
  },

  getUser() {
      // make sure we have an access token
      this.getToken();

      const url = process.env.REACT_APP_SPOTIFY_API_URL + 'me';

      return fetch(url,{
          method: 'GET',
          mode: 'cors',
          headers: {
            'Authorization': `Bearer ${oauthToken}`
          }
        }).then(response => {
        if ( response.ok ) {
          return response.json();
        }
//        console.log(`Received HTTP Response Status Code ${response.status}`);
        }, networkError => console.log(networkError.message)
        ).then(jsonResponse => {
//            console.log(JSON.stringify(jsonResponse, undefined, 2));
          if ( typeof jsonResponse != 'undefined' && jsonResponse.id ) {
            userId = jsonResponse.id;
//            console.log(`setting userid to ${userId}`);
          }
          return userId;
        });
  },


  search(term) {
      // make sure we have an access token
      this.getToken();

      const url = process.env.REACT_APP_SPOTIFY_API_URL + 'search?' +
                  'q='+encodeURIComponent(term) +
                  '&type='+encodeURIComponent(searchType);

      return fetch(url,{
          method: 'GET',
          mode: 'cors',
          headers: {
            'Authorization': `Bearer ${oauthToken}`
          }
        }).then(response => {
        if ( response.ok ) {
          return response.json();
        }
        // console.log(`Received HTTP Response Status Code ${response.status}`);
        // invalidate the user token if we have a failure here
        oauthToken = '';
        userId = '';
        }, networkError => console.log(networkError.message)
        ).then(jsonResponse => {
//            console.log(JSON.stringify(jsonResponse, undefined, 2));
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
          }
          return tracks;
      });
  },

  createPlayList(name) {
      if ( oauthToken === '' ) {
        alert('No Authorization Token present.');
        return {uri:'',id:''};

      } else if ( userId === '' ) {
        alert('Unable to retrieve user id from Spotify.');
        return {uri:'',id:''};

      } else {

        const url = process.env.REACT_APP_SPOTIFY_API_URL +
                    'users/' + userId + '/playlists';
        const body = {
          name: name,
          description: '',
          public: false
        }

        return fetch(url,{
          method: 'POST',
          mode: 'cors',
          headers: {
            'Authorization': `Bearer ${oauthToken}`
          },
          body: JSON.stringify(body)
        }).then(response => {
          if ( response.ok ) {
            return response.json();
          }
          alert('Failure creating playlist.');
          // console.log(`Received HTTP Response Status Code ${response.status}`);
          // invalidate the user token if we have a failure here
          oauthToken = '';
          userId = '';
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
        alert('No Authorization Token present.');
        return '';

      } else if ( userId === '' ) {
        alert('Unable to retrieve user id from Spotify.');
        return {uri:'',id:''};

      } else {

        const url = process.env.REACT_APP_SPOTIFY_API_URL +
                    'playlists/' +
                    playListId +
                    '/tracks';
        const body = {
          uris: uris,
          position: 0
        }

        return fetch(url,{
          method: 'POST',
          mode: 'cors',
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
          // console.log(`Received HTTP Response Status Code ${response.status}`);
          // invalidate the user token if we have a failure here
          oauthToken = '';
          userId = '';
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
