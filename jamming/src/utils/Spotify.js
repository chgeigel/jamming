const CORS_URL='https://cors-anywhere.herokuapp.com/';
//const CORS_URL='';
const SPOTIFY_SEARCH_API_URL = 'https://api.spotify.com/v1/search';
var oauthToken = 'BQBJhMVDvN_kVO1PDHjS1ZecThLHybzeua8NqYbXcji-CBhhCYYxhTIjqXrV';

export const Spotify = {

  search(term) {
    return fetch(`${CORS_URL}${SPOTIFY_SEARCH_API_URL}?q=${term}&type=album,artist,track`,{
        headers: {
          'Authorization': `Bearer ${oauthToken}`
        }
      }
    ).then(response => {
      console.log(response);
      if ( response.ok ) {
        return response.json();
      }
      throw new Error('Request failed');
      }, networkError => console.log(networkError.message)
    ).then(jsonResponse => {
        console.log(jsonResponse);
        /*
        if(jsonResponse.businesses) {
        return jsonResponse.businesses.map(business => {
          console.log(JSON.stringify(business));
          return {
            id: business.id,
            imageSrc: business.image_url,
            name: business.name,
            address: business.location.address1 +((business.location.address2 !=='' && business.location.address2!==null)?', '+ business.location.address2:'') +((business.location.address3!=='' && business.location.address3!==null)?', '+business.location.address3:''),
            city: business.location.city,
            state: business.location.state,
            zipCode: business.location.zip_code,
            category: business.categories[0].title,
            rating: business.rating,
            reviewCount: business.review_count
          }
        });
      }
        */
      }
    );
  }
}
