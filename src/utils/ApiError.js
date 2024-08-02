class ApiError extends Error{
    constructor(
        statuscode,
        message = "ERROR not mentioned",
    ){
        super(message)
        this.statuscode = statuscode
        this.message = message
        this.success = false
    }
}

export {ApiError}