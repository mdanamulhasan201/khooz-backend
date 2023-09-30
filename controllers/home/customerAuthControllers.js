const CustomerModal = require("../../models/CustomerModal");
const SellerCustomerModal = require("../../models/chat/SellerCustomerModal");
const { createToken } = require("../../utiles/createToken");
const { responseReturn } = require("../../utiles/response");
const bcrypt = require("bcrypt");

class customerAuthControllers {
  customer_register = async (req, res) => {
    const { name, email, password } = req.body;
    try {
      const customer = await CustomerModal.findOne({ email });
      if (customer) {
        responseReturn(res, 404, { error: "Email already exits" });
      } else {
        const createCustomer = await CustomerModal.create({
          name: name.trim(), //trim mainly use kora hoi word er space thakle jeno remove hoiye jai
          email: email.trim(),
          password: await bcrypt.hash(password, 10),
          method: "manually",
        });
        await SellerCustomerModal.create({
          myId: createCustomer.id,
        });
        const token = await createToken({
          id: createCustomer.id,
          name: createCustomer.name,
          email: createCustomer.email,
          method: createCustomer.method,
        });
        res.cookie("customerToken", token, {
          expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });
        responseReturn(res, 201, { message: "Register Success", token });
      }
      console.log(customer);
    } catch (error) {
      console.log(error.message);
    }
  };

  customer_login = async (req, res) => {
    const { email, password } = req.body;
    try {
      const customer = await CustomerModal.findOne({ email }).select(
        "+password"
      );
      if (customer) {
        const match = await bcrypt.compare(password, customer.password);
        if (match) {
          const token = await createToken({
            id: customer.id,
            name: customer.name,
            email: customer.email,
            method: customer.method,
          });
          res.cookie("customerToken", token, {
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          });
          responseReturn(res, 201, { message: "Login success", token });
        } else {
          responseReturn(res, 404, { error: "Password wrong" });
        }
      } else {
        responseReturn(res, 404, { error: "Email not found" });
      }
    } catch (error) {}
  };
}

module.exports = new customerAuthControllers();
