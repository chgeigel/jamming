
var userId = '';
var oauthToken = '';

var searchType = 'track'; /* track, artist, ablum */

export const Spotify = {

  makeRequest(method, url) {
    return new Promise(function (resolve, reject) {
      var xhr = new XMLHttpRequest();
      xhr.open(method, url);
      xhr.onload = function () {
        if (this.status >= 200 && this.status < 300) {
          resolve(xhr.response);
        } else {
          reject({
            status: this.status,
            statusText: xhr.statusText
          });
        }
      };
      xhr.onerror = function () {
        reject({
          status: this.status,
          statusText: xhr.statusText
        });
      };
//      xhr.setRequestHeader('Access-Control-Allow-Origin','*');
      xhr.send();
    });
  },

  getToken() {

    if ( oauthToken !== '' ) {
      console.log(`returning oauth token ${oauthToken}`);
      return oauthToken;
    }
    console.log(`Doing a GET of ${process.env.REACT_APP_SPOTIFY_LOGIN_URL}`);
    /*
    return fetch(process.env.REACT_APP_SPOTIFY_LOGIN_URL, {
      mode: 'cors',
      method: 'GET'
    }).then(response => {
      if ( response.ok) {
        console.log(response);
        return response.json();
      }
      alert('Failed to login');
      }, networkError => console.log(networkError.message)
    ).then(jsonResponse => {
      return jsonResponse;
    });
    */

    return this.makeRequest('GET',process.env.REACT_APP_SPOTIFY_LOGIN_URL).then(response => {
      console.log(response);
    });
  },

  search(term) {
      if ( oauthToken === '' ) {
        alert('No Authorization Token present.');
        return [];
      } else {

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
        alert('No Authorization Token present.');
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

      } else {

        const url = process.env.REACT_APP_.SPOTIFY_API_URL +
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
