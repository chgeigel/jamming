import React, { Component } from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import AppPlayList from '../AppPlayList/AppPlayList';
import {Spotify} from '../../utils/Spotify';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playListName: '',
      searchResults: [
        {
          id: '1',
          artists: ['Elton John','John Doe'],
          album: 'Madman Across The Water',
          name: 'Tiny Dancer'
        },
        {
          id: '2',
          artists: ['Tim McGraw'],
          album: 'Love Story',
          name: 'Tiny Dancer'
        },
        {
          id: '3',
          artists: ['Rockaby Baby!'],
          album: 'Lullaby Renditions of Elton John',
          name: 'Tiny Dancer'
        },
        {
          id: '4',
          artists: ['The White Raven'],
          album: 'Tiny Dancer',
          name: 'Tiny Dancer'
        },
        {
          id: '5',
          artists: ['Ben Folds'],
          album: 'Ben Folds Live',
          name: 'Tiny Dancer - Live Album Version'
        }
      ],
      playList: [
        {
          id: '6',
          artists: ['Britney Spears'],
          album: 'Oops!... I Did It Again',
          name: 'Stronger'
        },
        {
          id: '7',
          artists: ['Whitney Houston'],
          album: 'Whitney',
          name: 'So Emotional'
        },
        {
          id: '8',
          artists: ['Whitney Houston'],
          album: 'My Love is Your Love',
          name: "It's Not Right But It's Okay"
        }
      ]
    };
    this.handleAddTrackToPLayList = this.handleAddTrackToPLayList.bind(this);
    this.handleRemoveTrackFromPlayList = this.handleRemoveTrackFromPlayList.bind(this);
    this.handleChangePlayListName = this.handleChangePlayListName.bind(this);
    this.searchSpotify = this.searchSpotify.bind(this);
    this.savePlayList = this.savePlayList.bind(this);
  }

  handleAddTrackToPLayList(index) {
      var result = this.state.searchResults[index];
      const newList = this.state.playList.concat(result);
      this.setState({playList: newList});
  }

  handleRemoveTrackFromPlayList(index) {
    const newList = [...this.state.playList];
    newList.splice(index,1);
    this.setState({playList: newList});
  }

  handleChangePlayListName(name) {
    this.setState({playListName: name});
  }

  searchSpotify(searchTerm) {
    console.log(`Searching spotify for ${searchTerm}`);
//    Spotify.search(searchTerm);
  }

  savePlayList() {
    console.log(`saving playlist ${this.state.playListName}`);    
//    Spotify.createPlayList(this.state.playListName, this.state.playList);
  }

  render() {
    return (
      <div>
          <div className="App">
            <SearchBar searchSpotify={this.searchSpotify}/>
            <AppPlayList
                onAddToPlayList={this.handleAddTrackToPLayList}
                onRemoveFromPlayList={this.handleRemoveTrackFromPlayList}
                onChangePlayListName={this.handleChangePlayListName}
                savePlayList={this.savePlayList}
                searchResults={this.state.searchResults}
                playList={this.state.playList}/>
          </div>
      </div>
    );
  }
}

export default App;
