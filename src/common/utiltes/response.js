export default ({data, status= 200 , message ="done" , res })=>{
    res.status(status).json({
        data,
        message
    })

}