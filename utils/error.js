import { Error } from "mongoose"

export const ErrorHandler = (statuscode,message)=>{
    const error = new Error
    error.statuscode = statuscode
    error.message = message
    return error
}