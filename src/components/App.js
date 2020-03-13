import React from "react";
import SearchBar from "./SearchBar";
import JobDetails from "./JobDetails";
import "./styles.scss";
const axios = require("axios").default;

class App extends React.Component {
  state = {
    jobId: "",
    advertiserId: "",
    advertiserName: "",
    title: "",
    titleEncoded: "",
    teaser: "",
    lowerLimit: "",
    upperLimit: "",
    salaryVar: "",
    salaryMin: "",
    salaryMax: "",
    searchIsComplete: false,
    searchIsRunning: false
  };

  componentDidMount() {
    this.resetSearch();
  }

  onSearchSubmit = async term => {
    this.resetSearch();
    this.setState({ searchIsRunning: true, jobId: term });
    await this.getJobInfo(term).then(response => this.setJobInfo(response));
    await this.findMaximum();
    await this.findMinimum();
  };
  resetSearch = () => {
    console.log(`resetSearch`);
    this.setState(
      {
        advertiserId: "",
        advertiserName: "",
        title: "",
        teaser: "",
        lowerLimit: 0,
        upperLimit: 200000,
        salaryVar: 0,
        salaryMin: "",
        salaryMax: "",
        searchIsComplete: false,
        searchIsRunning: false
      },
      () => {
        this.setState({
          salaryVar:
            this.state.lowerLimit +
            (this.state.upperLimit - this.state.lowerLimit) / 2
        });
      }
    );
  };
  getJobInfo = term => {
    console.log(`getJobInfo`);
    return new Promise((resolve, reject) => {
      const response = axios.get(
        `${process.env.REACT_APP_EXPRESS_SERVER}/job-info/${term}`
      );
      resolve(response);
    });
  };
  setJobInfo = response => {
    console.log(`setJobInfo`);
    const advertiserId = response.data.data[0].advertiser.id;
    const advertiserName = response.data.data[0].advertiser.description;
    const title = response.data.data[0].title;
    const titleEncoded = encodeURI(
      response.data.data[0].title.replace(/[^a-zA-Z ]/g, " ")
    );

    const teaser = encodeURI(
      response.data.data[0].teaser
        .replace(/ html/gi, " ") // remove ' html' from teaser as Seek API has boolean enabled
        .replace(/ Html/gi, " ") // remove ' Html' from teaser as Seek API has boolean enabled
        .replace(/ HTML/gi, " ") // remove ' HTML' from teaser as Seek API has boolean enabled
        .replace(/ not /gi, " ") // remove ' not ' from teaser as Seek API has boolean enabled
        .replace(/[^a-zA-Z ]/g, " ") // remove special chars/only keep alpha chars
    );
    // const teaser = encodeURI(
    //   response.data.data[0].teaser.replace(/[^a-zA-Z ]/g, " ")
    // ).substring(0, 180);
    // hello knot not notting hill

    this.setState({
      advertiserId,
      advertiserName,
      title,
      titleEncoded,
      teaser
    });
  };
  findMaximum = async () => {
    console.log(`findMaximum`);
    for (let i = 0; i < 15; i++) {
      const response = await axios.get(
        `${process.env.REACT_APP_EXPRESS_SERVER}/salary-range/${
          this.state.advertiserId
        }/${Math.round(this.state.salaryVar)}/${Math.round(
          this.state.upperLimit
        )}/${this.state.titleEncoded}%20${this.state.teaser}`
      );
      if (response.data.totalCount >= 1) {
        this.setState({
          lowerLimit: this.state.salaryVar,
          salaryVar:
            this.state.salaryVar +
            (this.state.upperLimit - this.state.salaryVar) / 2
        });
      } else if (response.data.totalCount === 0) {
        this.setState({
          upperLimit: this.state.salaryVar,
          salaryVar:
            this.state.salaryVar -
            (this.state.salaryVar - this.state.lowerLimit) / 2
        });
      } else {
        console.log("Multiple job listings found");
      }
    }
    this.setState({
      salaryMax: this.state.salaryVar
    });
  };
  findMinimum = async () => {
    console.log(`findMinimum`);
    // Setup state to search for minimum
    this.setState(
      {
        lowerLimit: 0,
        upperLimit: this.state.salaryMax,
        salaryVar:
          this.state.lowerLimit +
          (this.state.upperLimit - this.state.lowerLimit) / 2
      },
      async () => {
        for (let i = 0; i < 10; i++) {
          const response = await axios.get(
            `${process.env.REACT_APP_EXPRESS_SERVER}/salary-range/${
              this.state.advertiserId
            }/${Math.round(this.state.lowerLimit)}/${Math.round(
              this.state.salaryVar
            )}/${this.state.titleEncoded}%20${this.state.teaser}`
          );
          if (
            response.data.totalCount >= 1
            // && response.data.data.find(item => item.id === parseInt(this.state.jobId, 10))
          ) {
            this.setState({
              upperLimit: this.state.salaryVar,
              salaryVar:
                this.state.salaryVar -
                (this.state.salaryVar - this.state.lowerLimit) / 2
            });
          } else if (response.data.totalCount === 0) {
            this.setState({
              lowerLimit: this.state.salaryVar,
              salaryVar:
                this.state.salaryVar +
                (this.state.upperLimit - this.state.salaryVar) / 2
            });
          } else {
            console.log("Multiple job listings found");
          }
        }
        this.setState({
          salaryMin: this.state.salaryVar,
          searchIsComplete: true,
          searchIsRunning: false
        });
      }
    );
  };

  render() {
    return (
      <div className="App">
        <h1>Seek Salary Calculator</h1>
        <SearchBar onSearchSubmit={this.onSearchSubmit} />
        <JobDetails
          advertiserName={this.state.advertiserName}
          title={this.state.title}
          salaryMin={this.state.salaryMin}
          salaryMax={this.state.salaryMax}
          searchIsComplete={this.state.searchIsComplete}
          searchIsRunning={this.state.searchIsRunning}
        />
      </div>
    );
  }
}
export default App;
