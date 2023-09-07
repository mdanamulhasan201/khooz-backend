const formidable = require("formidable");
const cloudinary = require("cloudinary").v2;
const productModal = require("../../models/productModal");
const { responseReturn } = require("../../utiles/response");

class productController {
  add_product = async (req, res) => {
    const { id } = req;
    const form = formidable({ multiples: true });

    form.parse(req, async (err, field, files) => {
      let {
        name,
        category,
        description,
        stock,
        price,
        discount,
        shopName,
        brand,
      } = field;
      const { images } = files;

      name = name.trim();
      const slug = name.split(" ").join("-");

      // cloudinary.config({
      //   cloud_name: process.env.cloud_name,
      //   api_key: process.env.api_key,
      //   api_secret: process.env.api_secret,
      //   secure: true,
      // });

      cloudinary.config({
        cloud_name: process.env.cloud_name,
        api_key: process.env.api_key,
        api_secret: process.env.api_secret,
        secure: true,
      });

      try {
        let allImageUrl = [];

        for (let i = 0; i < images.length; i++) {
          const result = await cloudinary.uploader.upload(images[i].filepath, {
            folder: "products",
          });
          allImageUrl = [...allImageUrl, result.url];
        }

        await productModal.create({
          sellerId: id,
          name,
          slug,
          shopName,
          category: category.trim(),
          description: description.trim(),
          stock: parseInt(stock),
          price: parseInt(price),
          discount: parseInt(discount),
          images: allImageUrl,
          brand: brand.trim(),
        });
        responseReturn(res, 201, { message: "product add success" });
      } catch (error) {
        responseReturn(res, 500, { error: error.message });
      }
    });
  };
  products_get = async (req, res) => {
    const { searchValue } = req.query;
    const { id } = req;
    try {
      if (searchValue) {
        // If searchValue is provided, perform a text search
        const products = await productModal.find({
          $text: { $search: searchValue },
          sellerId: id,
        });
        const totalProduct = await productModal
          .find({
            $text: { $search: searchValue },
            sellerId: id,
          })
          .countDocuments();
        responseReturn(res, 200, { totalProduct, products });
      } else {
        // If searchValue is not provided, return all products for the seller
        const products = await productModal.find({});
        const totalProduct = await productModal.find({}).countDocuments();
        responseReturn(res, 200, { products, totalProduct });
      }
    } catch (error) {
      console.log(error.message);
      // Handle any errors that may occur during the search
      responseReturn(res, 500, { error: "Internal server error" });
    }
  };

  // product get (edit product in sellers )
  product_get = async (req, res) => {
    const { productId } = req.params;
    try {
      const product = await productModal.findById(productId);
      responseReturn(res, 200, { product });
    } catch (error) {
      responseReturn(res, 500, { message: error.message });
    }
  };
  // product update (update product in sellers )
  product_update = async (req, res) => {
    let { name, description, discount, price, brand, productId, stock } =
      req.body;

    name = name.trim();
    const slug = name.split(" ").join("-");
    try {
      await productModal.findByIdAndUpdate(productId, {
        name,
        description,
        discount,
        price,
        brand,
        productId,
        stock,
        slug,
      });
      const product = await productModal.findById(productId);
      responseReturn(res, 200, { product, message: "product update success" });
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };

  product_image_update = async (req, res) => {
    const form = formidable({ multiples: true });
    form.parse(req, async (err, field, files) => {
      const { productId, oldImage } = field;
      const { newImage } = files;
      if (err) {
        responseReturn(res, 404, { error: err.message });
      } else {
        try {
          cloudinary.config({
            cloud_name: process.env.cloud_name,
            api_key: process.env.api_key,
            api_secret: process.env.api_secret,
            secure: true,
          });
          const result = await cloudinary.uploader.upload(newImage.filepath, {
            folder: "products",
          });
          if (result) {
            let { images } = await productModal.findById(productId);
            const index = images.findIndex((img) => img === oldImage);
            images[index] = result.url;
            await productModal.findByIdAndUpdate(productId, {
              images,
            });
            const product = await productModal.findById(productId);
            responseReturn(res, 200, {
              product,
              message: "product image update success",
            });
          } else {
            responseReturn(res, 404, { error: "image upload failed" });
          }
        } catch (error) {
          responseReturn(res, 404, { error: error.message });
        }
      }
    });
  };
}

module.exports = new productController();
