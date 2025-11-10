const arcjet = require("@arcjet/node").default;
const { shield, detectBot, slidingWindow } = require("@arcjet/node");

const aj = arcjet({
  key: process.env.ARCJET_KEY,
  rules: [
    // Protect from common attacks like SQL injection
    shield({ mode: "LIVE" }),

    //  Detect and block bots
    detectBot({
      mode: "LIVE", // use "DRY_RUN" for testing without blocking
      allow: [
        "CATEGORY:SEARCH_ENGINE", // allow Google, Bing, etc.
        
      ],
    }),

    // ⚡ Apply rate limiting (Sliding Window)
    slidingWindow({
      mode: "LIVE",
      max: 100, // max requests per window
      interval: 60, // window in seconds
    }),
  ],
});

module.exports = aj;
