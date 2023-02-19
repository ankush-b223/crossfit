//connecting with database access layer
const Workout = require("../database/Workout");

//unique 16 digit creator for automatic id creation
const { v4: uuid } = require("uuid");





//for request to get all workouts
const getAllWorkouts = (filterParams) =>{

    try{
        //call db access layer for all the workout data
        const allWorkouts = Workout.getAllWorkouts(filterParams);

        //return the response from db access layer
        return allWorkouts;

    }catch(error){//error handler for server errors thrown down the layers
        throw error;
    }
}






//for the request to get an unique workout
const getOneWorkout = (workoutId) =>{

    try{
        //calling db access layer for data sending workoutId as argument
        const oneWorkout = Workout.getOneWorkout(workoutId);

        //returning object from db access layer as response
        return oneWorkout;
    }catch(error){//error handler for server errors thrown down the layers
        throw error;
    }
}





// for the req to delete an exisitng record 
const deleteOneWorkout = (workoutId)=>{
    try{
        //call to db access layer with workoutId as argument
        Workout.deleteWorkout(workoutId);
    }catch(error){//error handler for server errors thrown down the layers
        throw error;
    }
}





//for the req to update an exisitng workout
const updateOneWorkout = (workoutId,body)=>{
    
    try{
        //sending arguments to db access layer 
        const updatedWorkout = Workout.updateOneWorkout(workoutId,body);

        //return call object 
        return updatedWorkout;
    }catch(error){//error handler for server errors thrown down the layers
        throw error;
    }

}







//for the req to create a new workout
//accepts data obj newWorkout containg fetched data from req body
const createNewWorkout = (newWorkout) => {

    //create a new object
    const workoutToInsert = {
        //copying all data from newWorkout object
      ...newWorkout,
      //appending fields which needed to be automated
      //id pk
      id: uuid(),
      //time related data
      createdAt: new Date().toLocaleString("en-US", { timeZone: "UTC" }),
      updatedAt: new Date().toLocaleString("en-US", { timeZone: "UTC" }),
    };


    try{ 
        //calling db access layer with new obj workoutToInsert as argument 
        //having all data which needs pushing to db
        const createdWorkout = Workout.createNewWorkout(workoutToInsert);

        //returning the response obj to controller call
        return createdWorkout;

    }catch(error){//error handler for server errors thrown down the layers
        throw error;
    }


};





//exporting all the methods created in this service layer
module.exports = {

    getAllWorkouts,
    getOneWorkout,
    updateOneWorkout,
    createNewWorkout,
    deleteOneWorkout,

}