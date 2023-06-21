const mongoose = require("mongoose");

const courseSchema = mongoose.Schema(
    {
      title: {
        type: String,
        required: true,
        trim: true,
      },
      link:{
        type:String,
        required:true,
      },
  
      price: {
        type: Number,
     
        required: true,
        trim: true,
      },
     
      image_url: {
        type: String,
     
        required: true,
        trim: true,
      
      },
      category: {
        type: String,
  
        trim: true,
      },
  
      description: {
        type: String,
  
        trim: true,
      },
  
      is_active: {
        type: Boolean,
        default: true,
      },
    },
    {
      timestamps: true,
    }
  );
  const Course = mongoose.model("course", courseSchema);

module.exports = Course;
