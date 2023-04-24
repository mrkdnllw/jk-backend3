import * as dotenv from "dotenv";
import cors from "cors";
import express from "express";
import { connectToDatabase } from "./database";
import { connectToDatabase2 } from "./database2";
import { employeeRouter } from "./employee.routes";

import { userRouter } from "./user.routes";

// Load environment variables from the .env file, where the ATLAS_URI is configured
dotenv.config();

const { ATLAS_URI } = process.env;

if (!ATLAS_URI) {
    console.error("No ATLAS_URI environment variable has been defined in config.env");
    process.exit(1);
}

// connectToDatabase(ATLAS_URI)
//     .then(() => {
//         const app = express();

//         // const allowedOrigins = ['http://hello.com', 'http://google.com/', 'http://localhost:5200/', 'https://localhost:5200/', 'localhost:5200/'];

//         // app.use(cors({
//         //     origin: function (origin, callback) {
//         //         if (allowedOrigins.indexOf(origin) !== -1) {
//         //             callback(null, true);
//         //         } else {
//         //             callback(new Error('Not allowed by CORS'));
//         //         }
//         //     }
//         // }));

//         //before ni sha then bunch of endpoints
//         app.use("/employees", employeeRouter);

//         // start the Express server
//         app.listen(5200, () => {
//             console.log(`Server running at http://localhost:5200...`);
//         });

//     })
//     .catch(error => console.error(error));



    
connectToDatabase2(ATLAS_URI)
.then(() => {
    const app = express();

    // const allowedOrigins = ['http://hello.com', 'http://google.com/', 'http://localhost:5200/', 'https://localhost:5200/', 'localhost:5200/'];

    // app.use(cors({
    //     origin: function (origin, callback) {
    //         if (allowedOrigins.indexOf(origin) !== -1) {
    //             callback(null, true);
    //         } else {
    //             callback(new Error('Not allowed by CORS'));
    //         }
    //     }
    // }));

    app.use(cors({}));

    //before ni sha then bunch of endpoints
    app.use("/users", userRouter);

    const port = process.env.PORT || 5000;
    //port = 6000;

    // start the Express server
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}...`);
    });

})
.catch(error => console.error(error));