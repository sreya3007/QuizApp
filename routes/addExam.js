const router=require('express').Router();





router.post("/add", authMiddleware, async (req, res) => {
    try {
      // check if exam already exists
      const examExists = await Exam.findOne({ name: req.body.name });
      if (examExists) {
        return 
          res.status(200)
          res.send({ message: "Exam already exists", success: false });
      }
      req.body.questions = [];
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
  
  // get all exams
  router.post("/get-all-exams", authMiddleware, async (req, res) => {
    try {
      const exams = await Exam.find({});
      res.send({
        message: "Exams fetched successfully",
        data: exams,
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