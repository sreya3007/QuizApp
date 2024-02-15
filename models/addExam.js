const mongoose=require("mongoose");

const examSchema = new mongoose.Schema ({
    name: {
        type: String,
        required: true,
    },
    duration: {
        type: Number,
        required : true,
    },
    category: {
        type: String,
        required: true,
    },
    totalMarks: {
        type:Number,
        required: true,
    },
    passingMarks: {
        type:Number,
        required: true,
    },
    markPerQuestion: {
        type:Number,
        required: true,
    },
    questions: {
        type: [mongoose.Schema.Types.ObjectId],
        ref:questions,
        // this an array  which stores all the question id remember not the questions but its id
        required: true,
    }
})
const Exam = mongoose.model("exams",examSchema);
module.exports=Exam;