const mongoose = require("mongoose")

const connectionRequest = mongoose.Schema({
    fromUserId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true
    },
    ToUserId : {
        type : mongoose.Schema.Types.ObjectId,
        require : true
    },
    status : {
        type : String,
        enum : {
            value : ["ignore","interested","rejected","accepted"],
            message :`{VALUE} is not supported`
        },
    },
});

module.exports = mongoose.model("ConnectionRequestModel" ,connectionRequest);