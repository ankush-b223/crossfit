//calling express dependency to use its router method
const express = require("express");

const apicache = require("apicache");



//connecting with controller to call down the architecture
const workoutController = require("../../controllers/workoutController");
const recordController = require("../../controllers/recordController");

//creating router object 
const router = express.Router();

const cache = apicache.middleware;

/**
 * @openapi
 * /api/v1/workouts:
 *   get:
 *     tags:
 *       - Workouts
 *     parameters:
 *       - in: query
 *         name: mode
 *         schema:
 *           type: string
 *         description: The mode of a workout
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: OK
 *                 data:
 *                   type: array 
 *                   items: 
 *                     $ref: "#/components/schemas/Workout"
 *       5XX:
 *         description: FAILED
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: 
 *                   type: string
 *                   example: FAILED
 *                 data:
 *                   type: object
 *                   properties:
 *                     error:
 *                       type: string 
 *                       example: "Some error message"
 */






//for main route as in server file 
//fetching all the existing workouts
//calling controller for the requested data
router.get("/",cache("2 minutes"),workoutController.getAllWorkouts);

//route to get an single workout from db 
//calling controller for data
router.get("/:workoutId", workoutController.getOneWorkout);

//to push a new workout data
//post https method to push data 
//using main route to do so
//calling controller layer to push data
router.post("/", workoutController.createNewWorkout);

//to update an existing record in db
//calling controller
router.patch("/:workoutId", workoutController.updateOneWorkout);

//to delete an existing workout
//calling controller
router.delete("/:workoutId",workoutController.deleteOneWorkout);


//to get records data of specified workoutId
router.get("/:workoutId/records" , recordController.getRecordForWorkout)

//exporting router object
module.exports = router;