// error response
module.exports.responseReturn = (res,code,data)=>{
    return res.status(code).json(data)
}