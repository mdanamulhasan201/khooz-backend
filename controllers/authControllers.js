// OOP (Controller class base create )
const adminModal = require("../models/adminModal");
const sellerModal = require("../models/sellerModal");
const sellerCustomerModal = require("../models/chat/SellerCustomerModal");
const bcrypt = require("bcrypt");
const { responseReturn } = require("../utiles/response");
const { createToken } = require("../utiles/createToken");
const formidable = require("formidable");
const cloudinary = require("cloudinary").v2;

class authControllers {
  // admin login
  admin_login = async (req, res) => {
    // console.log(req.body);
    const { email, password } = req.body; //distructer
    try {
      const admin = await adminModal.findOne({ email }).select("+password");
      if (admin) {
        const match = await bcrypt.compare(password, admin.password);
        if (match) {
          // if password match then make token (using json web token)
          const token = await createToken({
            id: admin.id,
            role: admin.role,
          });
          // cookie set
          res.cookie("accessToken", token, {
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // now date + 7days (7days convert millisecond 1st - (7*24 hr convert *60 min convert * 60 sec * 1000 convert millisecond))
          });
          responseReturn(res, 200, { token, message: "Login success" });
        } else {
          responseReturn(res, 404, { error: "Invalid Password" });
        }
      } else {
        responseReturn(res, 404, { error: "Email not Found" });
      }
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };

  // seller register
  seller_register = async (req, res) => {
    const { email, name, password } = req.body;
    try {
      const getUser = await sellerModal.findOne({ email });
      console.log(getUser);
      if (getUser) {
        responseReturn(res, 404, { error: "Email Already exit" });
      } else {
        const seller = await sellerModal.create({
          name,
          email,
          password: await bcrypt.hash(password, 10),
          method: "manually",
          shopInfo: {},
        });
        await sellerCustomerModal.create({
          myId: seller.id,
        });
        const token = await createToken({
          id: seller.id,
          role: seller.role,
        });
        res.cookie("accessToken", token, {
          expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // now date + 7days (7days convert millisecond 1st - (7*24 hr convert *60 min convert * 60 sec * 1000 convert millisecond))
        });
        responseReturn(res, 201, { token, message: "Register Success" });
      }
    } catch (error) {
      responseReturn(res, 500, { error: "Internal server error" });
    }
  };

  // seller login

  seller_login = async (req, res) => {
    // console.log(req.body);
    const { email, password } = req.body; //distructer
    try {
      const seller = await sellerModal.findOne({ email }).select("+password");
      if (seller) {
        const match = await bcrypt.compare(password, seller.password);
        if (match) {
          // if password match then make token (using json web token)
          const token = await createToken({
            id: seller.id,
            role: seller.role,
          });
          // cookie set
          res.cookie("accessToken", token, {
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // now date + 7days (7days convert millisecond 1st - (7*24 hr convert *60 min convert * 60 sec * 1000 convert millisecond))
          });
          responseReturn(res, 200, { token, message: "Login success" });
        } else {
          responseReturn(res, 404, { error: "Invalid Password" });
        }
      } else {
        responseReturn(res, 404, { error: "Email not Found" });
      }
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };

  logout = async (req, res) => {
    try {
      res.cookie("accessToken", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
      });
      responseReturn(res, 200, { message: "logout success" });
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };

  // user info get (authRoutes)
  getUser = async (req, res) => {
    const { id, role } = req; //req theke id and role distructer

    try {
      //use try catch and get database info
      if (role === "admin") {
        const user = await adminModal.findById(id);
        responseReturn(res, 200, { userInfo: user });
      } else {
        const seller = await sellerModal.findById(id);
        responseReturn(res, 200, { userInfo: seller });
      }
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };

  profile_image_upload = async (req, res) => {
    const { id } = req;
    const form = formidable({ multiples: true });
    form.parse(req, async (err, _, files) => {
      cloudinary.config({
        cloud_name: process.env.cloud_name,
        api_key: process.env.api_key,
        api_secret: process.env.api_secret,
        secure: true,
      });
      const { image } = files;
      try {
        const result = await cloudinary.uploader.upload(image.filepath, {
          folder: "profile",
        });
        if (result) {
          await sellerModal.findByIdAndUpdate(id, {
            image: result.url,
          });
          const userInfo = await sellerModal.findById(id);
          responseReturn(res, 201, {
            message: "image upload success",
            userInfo,
          });
        } else {
          responseReturn(res, 404, { error: "image upload failed" });
        }
      } catch (error) {
        responseReturn(res, 500, { error: error.message });
      }
    });
  };

  profile_info_add = async (req, res) => {
    const {
      category,
      shopName,
      mobileNumber,
      division,
      district,
      thana,
      village,
      about,
    } = req.body;
    const { id } = req;

    try {
      await sellerModal.findByIdAndUpdate(id, {
        shopInfo: {
          category,
          shopName,
          mobileNumber,
          division,
          district,
          thana,
          village,
          about,
        },
      });
      const userInfo = await sellerModal.findById(id);
      responseReturn(res, 201, {
        message: "profile info add success",
        userInfo,
      });
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };
}
module.exports = new authControllers();
