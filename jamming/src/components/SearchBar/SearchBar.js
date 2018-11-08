import React from 'react';
import './SearchBar.css';


class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.handleSearch = this.handleSearch.bind(this);
  }

  handleSearch(event) {
    this.props.searchSpotify(document.getElementById('searchTerm').value);
    event.preventDefault();
  }

  render() {
    return (
      <div className="SearchBar">
          <input id='searchTerm' placeholder="Enter A Song Title/Artist/Album Name" />
          <a onClick={this.handleSearch}>SEARCH</a>
      </div>
    );
  }
}

export default SearchBar;
