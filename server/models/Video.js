const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const videoSchema = mongoose.Schema({
    writer: {
        type:Schema.Types.ObjectId, //글쓴이를 넣는데.이렇게 하는 이유는 User schema 전체 정보를 긁어올수 있음
        ref:'User' //불러 오는곳
    },
    title:{
        type:String,
        maxlength:50
    },
    description:{
        type:String
    },
    privacy:{
        type:Number
    },
    filePath:{
        type:String
    },
    category:{
        type:String
    },
    views:{
        type:Number, 
        default:0 //view 수가 처음부터 0부터 시작하니까
    },
    duration:{
        type:String
    },
    thumbnail:{
        type:String
    }
}, { timestamps:true }); //글쓴거 업로드 한거 날짜 적어야 하니까.

const Video = mongoose.model("Video" , videoSchema)

module.exports = {Video}