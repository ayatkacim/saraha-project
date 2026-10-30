export const vaildator = (schema)=>{
    return (req,res,next)=>{
        let {success, error , data} = schema(req.headers["accept-language"]).safeParse({
            body: req.body,
            params : req.params,
            query: req.query,
            headers:req.headers
        })
        
            if(!success){
                return res.status(400).json({
                    message:"validation error",
                    issues: error.issues
                })
        
            }
            req.vaildate = data
            next()
    }
}