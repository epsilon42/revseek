const express = require("express");
const request = require("request");

const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});
// app.use(express.static(__dirname + "/public"));

app.get("/job-info/:jobid", (req, res) => {
  request(
    {
      url: `https://www.seek.com.au/api/chalice-search/search?jobid=${req.params.jobid}`
    },
    (error, response, body) => {
      if (error || response.statusCode !== 200) {
        return res.status(500).json({ type: "error", message: err.message });
      }

      res.json(JSON.parse(body));
    }
  );
});

app.get(
  "/salary-range/:advertiserid/:salaryLower/:salaryUpper/:teaser",
  (req, res) => {
    request(
      {
        url: `https://www.seek.com.au/api/chalice-search/search?keywords=${req.params.teaser}&advertiserid=${req.params.advertiserid}&salaryrange=${req.params.salaryLower}-${req.params.salaryUpper}`
      },
      (error, response, body) => {
        if (error || response.statusCode !== 200) {
          return res.status(500).json({ type: "error", message: err.message });
        }
        res.json(JSON.parse(body));
      }
    );
  }
);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`listening on ${PORT}`));
