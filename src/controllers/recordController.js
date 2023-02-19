//connecting with records' service layer
const recordService = require("../services/recordService");

//to get records of a workoutId
const getRecordForWorkout = (req,res) =>{

    //fetch the workoutId from parameter of request
    const{
        params: {workoutId},
    } = req;

    //validation check
    if(!workoutId){
        res
        .status(400)
        .send({
            status:"Failed",
            data:{
                error:
                    `Parameter must have workoutID`,
            },
        })
    }

    //calling service layer with the wrokoutId as the argument to the call
    try{
        const record = recordService.getRecordForWorkout(workoutId);

        res.send({status: "ok" , data: record});

    }catch(error){
        res
        .status(error?.status || 500)
        .send({
            data:{
                error:
                    error?.message || error,
            },
        })
    }

}

//exporting functions 
module.exports = {
    getRecordForWorkout,
}