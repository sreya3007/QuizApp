const router=require('express').Router();
const Exam = require("../models/addExams");
const { forwardAuthenticated } = require('../configs/auth');
const Question=require('../models/addQuestions');


 //adding exams 
router.post("/add", forwardAuthenticated , async (req, res) => {
    try {
      // check if exam already exists
      const examExists = await Exam.findOne({ name: req.body.name }); // name of the exam find the name in the database
      if (examExists) { 
          res.status(200).send({ message: "Exam already exists", success: false });
      }
      req.body.questions = []; // initially the questions array is empty because no questions are added to a new exam
      const newExam = new Exam(req.body);
      await newExam.save();
      res.send({
        message: "Exam added successfully",
        success: true,
      });
    } catch (error) {
      res.status(500).send({
        message: error.message,
        data: error,
        success: false,
      });
    }
  });
  
 //fetching the exams

  router.post("/get-all-exams", forwardAuthenticated , async (req, res) => {
    try {
      const exams = await Exam.find({}); // finding the exams in the database
      res.send({ 
        message: "Exams fetched successfully", 
        data: exams, // sending in the fetched exams 
        success: true,
      });
    } 
    catch (error) {
      res.status(500).send({
        message: error.message,
        data: error,
        success: false,
      });
    }
  });

  // edit exam by id we could also do using name it may happen that we will have same named different 
  // exam thats why we prefer using id

router.post("/edit-exam-by-id", forwardAuthenticated, async (req, res) => {
    try {
      await Exam.findByIdAndUpdate(req.body.examId, req.body); // find exam by id and then upadte the new changes
      res.send({
        message: "Exam edited successfully",
        success: true,
      });
    } catch (error) {
      res.status(500).send({
        message: error.message,
        data: error,
        success: false,
      });
    }
  });

  //deleting a exam
  router.post("/delete-exam-by-id", forwardAuthenticated, async (req, res) => {
    try {
      await Exam.findByIdAndDelete(req.body.examId); // find exam by id and then upadte the new changes
      res.send({
        message: "Exam deleted successfully",
        success: true,
      });
    } catch (error) {
      res.status(500).send({
        message: error.message,
        data: error,
        success: false,
      });
    }
  });

// adding questions to the exam created

  router.post("/add-question-to-exam",forwardAuthenticated, async (req, res) => {
    try {
      // add question to Questions collection 
      const newQuestion = new Question(req.body);
      const question = await newQuestion.save(); // saving the question object definded in the models folder
      // add question to exam
      // here we try to find exam by id
      const exam = await Exam.findById(req.body.exam);// finding the exam to which question has to be added
      exam.questions.push(question._id); // pushing the questions to that exam 
      await exam.save(); // saving the updated exam with question
      res.send({
        message: "Question added successfully",
        success: true,
      });
    } catch (error) {
      res.status(500).send({
        message: error.message,
        data: error,
        success: false,
      });
    }
  });


  router.post("/edit-question-by-id", forwardAuthenticated, async (req, res) => {
    try {
        //edited the question in the question object in database we also have to show the changes in the actual exam
      await Exam.findByIdAndUpdate(req.body.examId, req.body); // find exam by id and then upadte the new changes
      res.send({
        message: "Question edited successfully",
        success: true,
      });
    } catch (error) {
      res.status(500).send({
        message: error.message,
        data: error,
        success: false,
      });
    }
  });

  router.post("/delete-question-by-id", forwardAuthenticated, async (req, res) => {
    try {
      await Exam.findByIdAndDelete(req.body.examId); // find exam by id and then upadte the new changes
      res.send({
        message: "Question deleted successfully",
        success: true,
      });
    } catch (error) {
      res.status(500).send({
        message: error.message,
        data: error,
        success: false,
      });
    }
  });

  module.exports = router;