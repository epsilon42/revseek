import React from "react";
import Spinner from "./Spinner";

const JobDetails = ({
  advertiserName,
  title,
  salaryMin,
  salaryMax,
  searchIsComplete,
  searchIsRunning
}) => {
  salaryMin = (Math.round(salaryMin / 500) * 500).toLocaleString(); // Round to nearest $500
  salaryMax = (Math.round(salaryMax / 500) * 500).toLocaleString();

  return (
    <div className="JobDetails">
      {/* {searchIsComplete ? "searchIsComplete true" : "searchIsComplete false"}
      {searchIsRunning ? "searchIsRunning true" : "searchIsRunning false"} */}

      <div className="salary">
        {searchIsRunning && (
          <>
            <div className="spinner">
              <Spinner />
            </div>

            <span>Reticulating Splines... </span>
          </>
        )}
        {searchIsComplete && (
          <>
            <span className="lower">${salaryMin}</span> -{" "}
            <span className="upper">${salaryMax}</span>
          </>
        )}
      </div>

      <div className="description">
        <span className="title">{title}</span>
        <span className="advertiserName">{advertiserName}</span>
      </div>
    </div>
  );
};

export default JobDetails;
