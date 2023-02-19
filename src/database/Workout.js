//connecting with db file
const DB = require("./db.json");

//connecting with utility function which writes new data to DB
const { saveToDatabase } = require("./utils");

/**
 * @openapi
 * components:
 *   schemas:
 *     Workout:
 *       type: object
 *       properties:
 *         id: 
 *           type: string
 *           example: 61dbae02-c147-4e28-863c-db7bd402b2d6
 *         name: 
 *           type: string
 *           example: Tommy V  
 *         mode:
 *           type: string
 *           example: For Time
 *         equipment:
 *           type: array
 *           items:
 *             type: string
 *           example: ["barbell", "rope"]
 *         exercises:
 *           type: array
 *           items:
 *             type: string
 *           example: ["21 thrusters", "12 rope climbs, 15 ft", "15 thrusters", "9 rope climbs, 15 ft", "9 thrusters", "6 rope climbs, 15 ft"]
 *         createdAt:
 *           type: string
 *           example: 4/20/2022, 2:21:56 PM
 *         updatedAt: 
 *           type: string
 *           example: 4/20/2022, 2:21:56 PM
 *         trainerTips:
 *           type: array
 *           items:
 *             type: string
 *           example: ["Split the 21 thrusters as needed", "Try to do the 9 and 6 thrusters unbroken", "RX Weights: 115lb/75lb"]
 */





//utility functions 

//implement multiple parameters + genralize customsort for different params as sorter
//implement for sorts for ascending or descending

//fn to sort records by date
function customSort(prev,next){
    
    return new Date(prev.createdAt).getTime() - new Date(next.createdAt).getTime(); //descending logic
}

//pagination function which returns an array object having the start & end index
function paginate(page){
    //the page limit set by developer
    const limit =3;
    //calculating the total pages possible from db
    const pageCount = Math.ceil( DB.workouts.length / limit);
    
    //if no page query exists //feature is yet to be added
    if(!page){
        page = 1;
    }

    //if page exeeds pagecount then set page as the last page
    if(page>pageCount){
        page = pageCount;
    }

    //calculate last & first indexes for slicing call
    startIndex = limit*(page-1);
    endIndex = limit*page;

    //empty array initialization for returning both the indexes
    let indexes = {};

    //alloting the values to the array
    indexes.start = startIndex;
    indexes.end = endIndex;

    //returning array
    return indexes;
}













//exporting functions

//for req to get all workouts in db
const getAllWorkouts = (filterParams) =>{

    try{
        let workouts = DB.workouts;

        console.log(Object.keys(filterParams).length);

        if(Object.keys(filterParams).length>1){

            if(filterParams.length =!null && filterParams.sort != null){

            }

        }

        //if filtering is needed due to query received
        if(filterParams.mode){
            return DB.workouts.filter((workout)=>
                workout.mode.toLowerCase().includes(filterParams.mode)
            );
        }

        if(filterParams.equipment){
            return DB.workouts.filter((workout)=>
                workout.equipment.includes(filterParams.equipment)
            )
        }

        if(filterParams.name){
            return DB.workouts.filter((workout)=>
                workout.name.toLowerCase().includes(filterParams.name)
            )
        }
        

        if(filterParams.exercises){
            return DB.workouts.filter((workout)=>
                workout.exercises.includes(filterParams.exercises)
            )
        }
        
        if(filterParams.trainerTips){
            return DB.workouts.filter((workout)=>
                workout.trainerTips.includes(filterParams.trainerTips)
            )
        }
        //length query
        if(filterParams.length){
            return DB.workouts.slice(0,filterParams.length);
        }
        
        //page query
        if(filterParams.page){
            //to receive values from fn call
           let results = {}
           //calling pagination fn 
           results = paginate(filterParams.page);
            //slicing records and returning according to indexes by fn call
           return DB.workouts.slice(results.start,results.end);
        }

        //sort query
        if(filterParams.sort){
            //calling custom sort function & storing the results in resultant object initialized
            const resultant = DB.workouts.sort(customSort)

            //returning resultant as response to the request
            return resultant;
        }

        //no query return all
        return workouts;

    }catch(error){//records couldn't be fetched from the DB
        throw{
            status:error?.status || 500,
            message: error?.message || error
        }
    }

}












//to create new data entry in the db
//accepts new data object as argument
const createNewWorkout = (newWorkout) => {

    //validation check whether data to be inserted already exists
    const isAlreadyAdded =
        //name check
        DB.workouts.findIndex((workout) => workout.name === newWorkout.name) > -1;

    if (isAlreadyAdded) {
      throw{//error handling mechanism if the new workout with same name already exists
        status:400,
        message: `Workout with the name '${newWorkout.name}' already exists`,
      };
    }

    try{

        //push to data obj to db
        //assume workouts to be the table name of json db file where we will store the records
        DB.workouts.push(newWorkout);
        //to write data & make it persist calling utility fn
        saveToDatabase(DB);

        //return argument accepted
        return newWorkout;

    }catch(error){//records couldn't be fetched from the DB
        throw{
            status:error?.status || 500,
            message: error?.message || error
        }
    }
};









//to fetch an unique workout record from db found using workoutId
const getOneWorkout = (workoutId) =>{
    try{
        //finding & fetching whether a record exists with such an id 
        const workout = DB.workouts.find((workout) => workout.id === workoutId)

        //if no record 
        if(!workout){
            throw{//validation fail
                status:400,
                message: `Workout with workoutId '${workoutId}' is not found`,
            }
        }

        //return the found object
        return workout;
    }catch(error){//records couldn't be fetched from the DB
        throw {
            status:error?.status || 500,
            message: error?.message || error,
        }
    }
}








//req to update an existing record
const updateOneWorkout = (workoutId,body) =>{

    //fetching index to update
    const indexForUpdate = DB.workouts.findIndex((workout) => workout.id === workoutId)

    //validation check
    if(indexForUpdate === -1){
        throw{//validation fail
            status:400,
            message: `WorkoutId passed '${workoutId}' is not found`,
        }
    }

    try{
        //creating update object
        const updatedWorkout = {
            //put index
            ...DB.workouts[indexForUpdate],
            //update Body
            ...body,
            //update updatedAt
            updatedAt: new Date().toLocaleString("en-us" , { timeZone: "UTC"}),
        }

        //update the db with found index
        DB.workouts[indexForUpdate] = updatedWorkout;

        //make db persistent with utility fn call
        saveToDatabase(DB);

        //return the updatedObj
        return updatedWorkout;
    }catch(error){//records couldn't be fetched from the DB
        throw {
            status:error?.status || 500,
            message: error?.message ||error,
        }
    }
}








//delete workout call
const deleteWorkout = (workoutId) =>{

    //fetch index to be deleted
    const indexForDeletion = DB.workouts.findIndex(
        (workout) => workout.id === workoutId 
    );

    //validation check
    if(indexForDeletion === -1){
        throw{
            status:400,
            message: `WorkoutId '${workoutId}' given doesn't match to an existing record`,
        }
    }

    try{
        //delete fn
        DB.workouts.splice(indexForDeletion,1);

        //persistence Db call
        saveToDatabase(DB);
    }catch(error){//records couldn't be fetched from the DB
        throw {
            status: error?.status || 500,
            message: error?.message || error,
        }
    }

}














//exporting all fn defined
module.exports = {

    getAllWorkouts,
    createNewWorkout,
    getOneWorkout,
    updateOneWorkout,
    deleteWorkout,

}