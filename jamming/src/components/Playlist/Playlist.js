import React from 'react';
import './Playlist.css';
import TrackList from '../TrackList/TrackList';

class Playlist extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      playListName: ''
    }

    this.handleChangePlayListName = this.handleChangePlayListName.bind(this);
    this.handleSavePlayList = this.handleSavePlayList.bind(this);
  }

  handleChangePlayListName(event) {
    this.setState({playListName: event.target.value});
  }

  handleSavePlayList(event) {
    if ( this.state.playListName === '' ) {
      alert('You must specify a play list name.');
    } else {
      this.props.savePlayList(this.state.playListName);
    }
    event.preventDefault();
  }

  render() {
    return (
      <div className="Playlist">
        <input defaultValue='New Playlist' onChange={this.handleChangePlayListName}/>
        <TrackList tracks={this.props.playList} mode='remove' clickHandler={this.props.onRemoveFromPlayList}/>
        <a className="Playlist-save" onClick={this.handleSavePlayList}>SAVE TO SPOTIFY</a>
      </div>
    )
  }
}
export default Playlist;
