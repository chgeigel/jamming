import React from 'react';
import './SearchBar.css';


class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: ''
    };
    this.handleSearchTermChange = this.handleSearchTermChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
  }

  handleSearchTermChange(event) {
    this.setState({searchTerm: event.target.value});
  }

  handleSearch(event) {
    this.props.searchSpotify(this.state.searchTerm);
    event.preventDefault();
  }

  render() {
    if ( this.props.loginNeeded ) {
      return (
        <div className="SearchBar">
            <input placeholder="Enter A Song Title/Artist/Album Name" onChange={this.handleSearchTermChange}/>
            <a href='http://localhost:8888/'>LOGIN</a>
        </div>
      );
    }
    return (
      <div className="SearchBar">
          <input placeholder="Enter A Song Title/Artist/Album Name" onChange={this.handleSearchTermChange}/>
          <a onClick={this.handleSearch}>SEARCH</a>
      </div>
    );
  }
}

export default SearchBar;
