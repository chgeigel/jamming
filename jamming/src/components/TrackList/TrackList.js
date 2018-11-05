import React from 'react';
import './TrackList.css';
import Track from '../Track/Track';

class TrackList extends React.Component {


  render() {
    return (
      <div className="TrackList">
      {
        this.props.tracks.map((track,index) => <Track track={track} index={index} key={index} mode={this.props.mode} clickHandler={this.props.clickHandler}/>)
      }
      </div>
    );
  }
}
export default TrackList;
