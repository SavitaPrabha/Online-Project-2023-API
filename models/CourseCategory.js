const mongoose = require("mongoose");

const courseCategorySchema = mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
        trim: true,
        unique:true
      },
      image_url:{
        type:String,
        required:true

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
  const CourseCategory = mongoose.model("coursecategory", courseCategorySchema);

module.exports = CourseCategory;
