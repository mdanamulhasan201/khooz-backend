// OOP (Controller class base create )
const adminModal = require("../models/adminModal");
const sellerModal = require("../models/sellerModal");
const sellerCustomerModal = require("../models/chat/SellerCustomerModal");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { responseReturn } = require("../utiles/response");
const { createToken } = require("../utiles/createToken");

class authControllers {
  // admin login
  admin_login = async (req, res) => {
    console.log(req.body);
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
    console.log(req.body);
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
}
module.exports = new authControllers();
