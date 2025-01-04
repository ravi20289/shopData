exports.getLogin = async(req, res)=>{
    try {
        res.status(200).send("welcome to Deployment phase1")
    } catch (error) {
       res.status(400).json({mssg:error.message});  
    }
}