//server setup
const express = require("express");

//body parser to parse request json to json objects
const bodyParser = require("body-parser");

//router object to call the router
const v1WorkoutRouter = require("./v1/routes/workoutRoutes"); 

const {swaggerDocs: V1SwaggerDocs} = require("./v1/swagger");

//the server app
const app = express();

//listening port
const PORT = process.env.PORT || 3000;

//asking app to use body parser to parse json
app.use(bodyParser.json());

//main route
//router will start from this main route
app.use("/api/v1/workouts",v1WorkoutRouter);

//listening log
app.listen(PORT,()=>{
    console.log(`App is listening on port ${PORT}`);

    V1SwaggerDocs(app,PORT);
})