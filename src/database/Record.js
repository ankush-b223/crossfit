//connecting with the DB json file
const DB = require("./db.json");

//to get records for a workoutId
const getRecordForWorkout = (workoutId) =>{

    try{
        const record = DB.records.filter((record) => record.workout === workoutId);

        //validation check
        if(!record){
            throw{
                status: 400,
                message: `Can't find workout with workoutId` ,
            }
        }

        //returning the records
        return record;
        
    }catch(error){
        throw{
            status: error?.status || 500,
            message: error?.message || error,
        }
    }

}


module.exports = {
    getRecordForWorkout,
}