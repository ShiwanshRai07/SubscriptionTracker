import arcjet , {shield , detectBot , tokenBucket} from "@arcjet/node";
import {ARCJET_KEY} from "./env.js";



const aj = arcjet({

    key: ARCJET_KEY,
    characteristics: ["ip.src"],
    rules: [
        // Shield protects your app from common attacks e.g. SQL injection
        shield({ mode: "LIVE" }),
        // Create a bot detection rule
        detectBot({
            mode: "DRY_RUN",
            allow: [
                "CATEGORY:SEARCH_ENGINE",
                //"CATEGORY:MONITOR", // Uptime monitoring services
                //"CATEGORY:PREVIEW", // Link previews e.g. Slack, Discord
            ],
        }),
        tokenBucket({
            mode: "LIVE",
            refillRate: 5, // Refill 5 tokens per interval
            interval: 10, // Refill every 10 seconds
            capacity: 10, // Bucket capacity of 10 tokens
        }),
    ],
});


export default aj;