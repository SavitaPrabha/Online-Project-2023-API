const express = require("express");
const Course = require("../models/Course");
const CourseCategory= require("../models/CourseCategory")
const router = express.Router();

router.post("/insert", async (req, res) => {
  // Create a new course
  try {
    const { title,link, price, image_url, category, description } = req.body;

    const course = new Course({
      title,
      link,
      price,
      image_url,
      category,
      description,
    });
    await course.save();
   
    res.send({
      status: 1,
      message: "Course inserted successfully.",
      data: course,
    });
  } catch (error) {
    
      res.send({ status: 0, message: error.message, data: "" });
    
  }
});
router.post("/getall", async (req, res) => {
  
  try {
    const course = await Course.find();

    if (!course) {
      res.send({ status: 0, message: "Course not found", data: "" });
    }

    res.send({
      status: 1,
      message: "Courses get successfully.",
      data: course,
    });
  } catch (error) {
    {
      res.send({ status: 0, message: error.message, data: "" });
    }
  }
});
router.post("/getbyid", async (req, res) => {
  // find course by id
  try {
    const { id } = req.body;
    const course = await Course.findById({ _id: id });

    if (!course) {
      res.send({ status: 0, message: "Course not found", data: "" });
    }

    res.send({
      status: 1,
      message: "Course find successfully.",
      data: course,
    });
  } catch (error) {
    {
      res.send({ status: 0, message: error.message, data: "" });
    }
  }
});
router.post("/delete", async (req, res) => {
  
  try {
    const { id } = req.body;
    const course = await Course.findByIdAndDelete({ _id: id });

    if (!course) {
      res.send({ status: 0, message: "Course not found", data: "" });
    }

    res.send({
      status: 1,
      message: "Course deleted successfully.",
      data: course,
    });
  } catch (error) {
    {
      res.send({ status: 0, message: error.message, data: "" });
    }
  }
});

router.post("/filter", async (req, res) => {
  try {
    const { variables } = req.body;
   
    let pipe = [
      {
        $match: { is_active: true }, // Stage 1: for only product which is_online:True
      },
    ];

// search products
//     if (variables.searchTerm && variables.searchTerm !== "") {
//       pipe.push({
//         $match: {
//           course: {
//             $elemMatch: {
//               $or: [
//                 {
//                   title: { $regex: variables.searchTerm.trim(), $options: "i" },
//                 },
//                 {
//                   category: {
//                     $regex: variables.searchTerm.trim(),
//                     $options: "i",
//                   },
//                 },
//               ],
//             },
//           },
//         },
//       });

   
//  }
     // category searchTerm query
     if (variables.name && variables.name !== "") {
      //pipe.push({ $match: { category: variables.category } });
      pipe.push({
        $match: { title: variables.name },
      });
    }

    // category search query
    if (variables.category && variables.category !== "") {
      //pipe.push({ $match: { category: variables.category } });
      pipe.push({
        $match: { category: variables.category },
      });
    }


    const courses = await Course.aggregate(pipe);
    res.send({
      status: 1,
      message: "Query executed successfully.",
      data: courses,
      pipe
    });
  } catch (error) {
    res.send({ status: 0, message: error.message, data: "" });
  }
});
router.post("/update", async (req, res) => {
  try {

   const{id,title, price, duration,image_url, category, description }=req.body;
 
   const course=await Course.findOneAndUpdate(
      {_id:id},
      {
          $set:{
             title,
              price,
              duration,
              category,
              description,
              image_url
          },
      },
      {
          new:true,
      }
   );

    if (!course) {
      res.send({ status: 0, message: "Something went wrong", data: "" });
    }

    res.send({
      status: 1,
      message: "course updated successfully.",
      data: course,
    });
  } catch (error) {
    

    return res.send({ status: 0, message: "Something went wrong.", data: "" });
  }
});


module.exports = router;
