import React from 'react';
import './AppPlayList.css';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';

class AppPlayList extends React.Component {

  render() {
    return (
      <div className="AppPlayList">
        <SearchResults onAddToPlayList={this.props.onAddToPlayList} searchResults={this.props.searchResults}/>
        <Playlist onRemoveFromPlayList={this.props.onRemoveFromPlayList}
                  savePlayList={this.props.savePlayList}
                  playList={this.props.playList}/>
      </div>
    )
  }
}
export default AppPlayList;
