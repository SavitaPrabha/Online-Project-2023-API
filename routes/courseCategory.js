const express = require("express");
const Category = require("../models/CourseCategory");
const router = express.Router();

router.post("/insert", async (req, res) => {
  // Create a new category
  try {
    const { name,image_url } = req.body;

    const category = new Category({
      name,
      image_url
    });
    await category.save();

   
    res.send({
      status: 1,
      message: "Category inserted successfully.",
      data: category,
    });
  } catch (error) {
    {
      res.send({ status: 0, message: error.message, data: "" });
    }
  }
});
router.post("/getall", async (req, res) => {
  // Create a new category
  try {
    const category = await Category.find();

    if (!category) {
      res.send({ status: 0, message: "Category not found", data: "" });
    }

    res.send({
      status: 1,
      message: "Category get successfully.",
      data: category,
    });
  } catch (error) {
    {
      res.send({ status: 0, message: error.message, data: "" });
    }
  }
});
router.post("/getbyid", async (req, res) => {
    // find category by id
    try {
        const {id}=req.body
      const category = await Category.findById({_id:id});
  
      if (!category) {
        res.send({ status: 0, message: "Category not found", data: "" });
      }
  
      res.send({
        status: 1,
        message: "Category find successfully.",
        data: category,
      });
    } catch (error) {
      {
        res.send({ status: 0, message: error.message, data: "" });
      }
    }
  });
  router.post("/delete", async (req, res) => {
    // find category by id
    try {
        const {id}=req.body
      const category = await Category.findByIdAndDelete({_id:id});
  
      if (!category) {
        res.send({ status: 0, message: "Category not found", data: "" });
      }
  
      res.send({
        status: 1,
        message: "Category deleted successfully.",
        data: category,
      });
    } catch (error) {
      {
        res.send({ status: 0, message: error.message, data: "" });
      }
    }
  });
  
  // router.post("/delete", async (req, res) => {
  //   // find category by id
  //   try {
  //       const {id}=req.body
  //     const category = await Category.findByIdAndDelete({_id:id});
  
  //     if (!category) {
  //       res.send({ status: 0, message: "Category not found", data: "" });
  //     }
  
  //     res.send({
  //       status: 1,
  //       message: "Category deleted successfully.",
  //       data: category,
  //     });
  //   } catch (error) {
  //     {
  //       res.send({ status: 0, message: error.message, data: "" });
  //     }
  //   }
  // });
  
  
  router.post("/update", async (req, res) => {
    try {
  
     const{id,name,image_url  }=req.body;
   
     const category=await Category.findOneAndUpdate(
        {_id:id},
        {
            $set:{
               name,
                image_url
            },
        },
        {
            new:true,
        }
     );
  
      if (!category) {
        res.send({ status: 0, message: "Something went wrong", data: "" });
      }
  
      res.send({
        status: 1,
        message: "category updated successfully.",
        data: category,
      });
    } catch (error) {
      
  
      return res.send({ status: 0, message: "Something went wrong.", data: "" });
    }
  });
module.exports = router;
