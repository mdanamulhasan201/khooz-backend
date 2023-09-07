const { query } = require("express");
const categoryModal = require("../../models/categoryModal");
const { responseReturn } = require("../../utiles/response");
const formidable = require("formidable");

// image upload
const cloudinary = require("cloudinary").v2;

// admin category added

class categoryController {

  add_category = async (req, res) => {
    const form = formidable();
    form.parse(req, async (err, fields, files) => {
      if (err) {
        responseReturn(res, 404, { error: "something error" });
      } else {
        let { name } = fields;
        let { image } = files;
        name = name.trim();
        const slug = name.split(" ").join("-");
        cloudinary.config({
          cloud_name: process.env.cloud_name,
          api_key: process.env.api_key,
          api_secret: process.env.api_secret,
          secure: true,
        });

        try {
          const result = await cloudinary.uploader.upload(image.filepath, {
            folder: "categorys",
          });

          if (result) {
            const category = await categoryModal.create({
              name,
              slug,
              image: result.url,
            });
            responseReturn(res, 201, {
              category,
              message: "category add success",
            });
          } else {
            responseReturn(res, 404, { error: "Image upload failed" });
          }
        } catch (error) {
          responseReturn(res, 500, { error: "Internal server error" });
        }
      }
    });
  };

  
  get_category = async (req, res) => {
   
    const { searchValue } = req.query;
    
    try {
      if (searchValue) {
        // If searchValue is provided, perform a text search
        const categorys = await categoryModal.find({
          $text: { $search: searchValue },
        });
        responseReturn(res, 200, { categorys });
      } else {
        // If searchValue is not provided, you can handle this case accordingly
        // For example, you could return all categories if no searchValue is given
        const allCategories = await categoryModal.find({});
        responseReturn(res, 200, { categorys: allCategories });
      }
    } catch (error) {
      console.log(error.message);
      // Handle any errors that may occur during the search
      responseReturn(res, 500, { error: "Internal server error" });
    }
  };
}

module.exports = new categoryController();
