//connceting with db access layer of records
const Record = require("../database/Record");

//to get records by a wrokoutId
const getRecordForWorkout = (workoutId) =>{

    try{

        //calling db access layer with accepted argument as parameter
        const record = Record.getRecordForWorkout(workoutId);

        return record;

    }catch(error){
        throw error;
    }
}

//exporting functions
module.exports = {
    getRecordForWorkout,
}