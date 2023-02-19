//connecting with service layer
const workoutService = require("../services/workoutService");








//for getting all workouts' list request
const getAllWorkouts = (req,res)=>{

    let { sort } = req.query;


    let { page } = req.query;

    //object to store the received query from req (for transportation down the layers)
    let query = {};

    if(sort!=null){
        query.sort = sort;
    }

    if(page!=null){
        query.page = page;
    }


    let{length} = req.query;

    if(length!=null){
        query.length = length;
    }



    //looking for query objects from req
    let { mode,equipment,name,exercises,trainerTips } = req.query; 

    

    //if the query is not null put to the empty transporting object
    if(mode!= null){
        query.mode = mode;
    }
    if(equipment!=null){
        query.equipment = equipment;
    }
    if(name!= null){
        query.name = name;
    }
    if(exercises!= null){
        query.exercises = exercises;
    }
    if(trainerTips!= null){
        query.trainerTips = trainerTips;
    }


    
    try{ 
        //call service layer
        //send query object as argument 
        const allWorkouts = workoutService.getAllWorkouts(query);

        //send gained data from service layer
        res.send({status : "ok" , data: allWorkouts});

    }catch(error){//error handler for server errors thrown down the layers
        res
        .status(error?.status || 500)
        .send({status:"Failed" , data: {error: error?.message || error} })
    }
    
}










//for getting an unique workout data with unique workout ids' request
const getOneWorkout = (req,res)=>{

    //fetching workoutId from the route parameter
    const {
        params: { workoutId } ,
    } = req;

    //validation check whether any id is there or not
    if(!workoutId){
        res
        .status(401)
        .send({
            status:"Failed",
            data:{
                error:
                    "WorkoutId parameter can't be empty"
            },        
        })
    }
    try{
    //calling service layer & sending workoutId as argument
    const workout = workoutService.getOneWorkout(workoutId);
    //,,
    //returning object returned from service layer as the response
    res.send({status: "ok" , data: workout});
    }catch(error){//error handler for server errors thrown down the layers
        res
        .status(error?.status || 500)
        .send({
            status:"Failed",
            data: {
                error:
                    error?.message || error,
            },
        })
    }
}










//for the request to create a new workout entry
const createNewWorkout = (req,res)=>{

    //fetch all the json data from the request body
    const {body} = req;

    //invalid request check ( validation )
    if(
        //checking if any of the field is missing from the post request body
        !body.name ||
        !body.mode ||
        !body.equipment ||
        !body.exercises ||
        !body.trainerTips 
    ){//error handling mechanism
      //if input validation fails
        res
            .status(400)
            .send({
                status:"Failed",
                data:{
                    error:
                        "One of the following keys is missing from the request body ",
                },
            })
        return;
    }

    //creating an newWorkout object which has all the data fetched from the req body
    const newWorkout = {
        
        name: body.name,
        mode: body.mode,
        equipment: body.equipment,
        exercises: body.exercises,
        trainerTips: body.trainerTips,

    }
    try{

        //call service layer & send the newWorkout object created along with call
        const createdWorkout = workoutService.createNewWorkout(newWorkout);

        //send back response ( not so imp response as the request is to push a new workout data ,)
        res.status(201).send({status:"ok" , data: newWorkout});

    }catch(error){//error handler for server errors thrown down the layers
        res
            .status(error?.status || 500)
            .send({status: "Failed " ,
            data:{
                error:
                    error?.message || error ,
            },  
        })
    }
}










//for request to update an exisiting workout
const updateOneWorkout = (req,res)=>{

    //fetch workoutId from req link
    const {
        params: {workoutId},
    } = req;

    //fetch body from request

    const { body } = req;

    //validation check
    if(!workoutId){
        res
        .status(400)
        .send({
            data:{
                error:
                    "Parameter for workoutId can't be empty",
            },
        })
    }

    try{
        //call to service layer with workoutId & body as arguments
        const updatedWorkout = workoutService.updateOneWorkout(workoutId,body);

        //return call object returned
        res.send({status: "ok" , data: updatedWorkout});
    }catch(error){//error handler for server errors thrown down the layers
        res
        .status(error?.status || 500)
        .send({
            status:"Failed",
            data:{
                error:
                    error?.message ||error,
            },
        })
    }
}











//for the request to delete an exisitng workout
const deleteOneWorkout = (req,res)=>{
    
    //fetch workoutId from link
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
                    "WorkoutId parameter can't be empty",
            },
        })
    }

    try{
        //call to service layer with workoutId as argument
        workoutService.deleteOneWorkout(workoutId);
        
        //respond status code
        res.status(204).send({status: "ok"});

    }catch(error){//error handler for server errors thrown down the layers
        res
        .status(error?.status || 500)
        .send({
            status:"Failed",
            data:{
                error:
                    error?.message || error,
            },
        })
    }
}

















//exporting all the functions created in this controller layer
module.exports = {

    getAllWorkouts,
    getOneWorkout,
    createNewWorkout,
    updateOneWorkout,
    deleteOneWorkout,

}