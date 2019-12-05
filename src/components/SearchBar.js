import React from "react";

class SearchBar extends React.Component {
  state = {
    term: ""
  };

  extractJobId = term => {
    this.setState({
      term: term.split("?")[0]
    });
    return term.split("?")[0].replace(/[^0-9]/g, "");
  };

  onFormSubmit = e => {
    e.preventDefault();
    this.props.onSearchSubmit(this.extractJobId(this.state.term));
  };

  render() {
    return (
      <div className="SearchBar">
        <form action="" onSubmit={this.onFormSubmit}>
          <div>
            <input
              type="text"
              placeholder="Paste the URL for the job listing in here"
              value={this.state.term}
              onChange={e => this.setState({ term: e.target.value })}
            />
            <input type="submit" value="Calculate Salary Range" />
          </div>
        </form>
      </div>
    );
  }
}

export default SearchBar;
