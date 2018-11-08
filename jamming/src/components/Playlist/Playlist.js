import React from 'react';
import './Playlist.css';
import TrackList from '../TrackList/TrackList';

class Playlist extends React.Component {
  constructor(props) {
    super(props);
    this.handleSavePlayList = this.handleSavePlayList.bind(this);
  }

  handleSavePlayList(event) {
    if ( document.getElementById('playListName').value === '' ) {
      alert('You must specify a play list name.');
    } else {
      this.props.savePlayList(document.getElementById('playListName').value);
      document.getElementById('playListName').value='';
    }
    event.preventDefault();
  }

  render() {
    return (
      <div className="Playlist">
        <input placeholder='New Playlist' id='playListName'/>
        <TrackList tracks={this.props.playList} mode='remove' clickHandler={this.props.onRemoveFromPlayList}/>
        <a className="Playlist-save" onClick={this.handleSavePlayList}>SAVE TO SPOTIFY</a>
      </div>
    )
  }
}
export default Playlist;
