const adminOrderModal = require("../../models/orderModal/adminOrderModal");
const customerOrderModal = require("../../models/orderModal/customerOrderModal");
const moment = require("moment");
const {
  mongo: { ObjectId },
} = require("mongoose");
const { responseReturn } = require("../../utiles/response");
const cartModal = require("../../models/cartModal");
class orderController {
  // order cancel function(customer jodi time mot payment na kore tahole akta somoi order ta cancel hoiye jabe)
  paymentCheck = async (id) => {
    try {
      const order = await customerOrderModal.findById(id);
      if (order.payment_status === "unpaid") {
        await customerOrderModal.findByIdAndUpdate(id, {
          delivery_status: "cancelled",
        });
        await adminOrderModal.updateMany(
          {
            orderId: id,
          },
          {
            delivery_status: "cancelled",
          }
        );
      }
      return true;
    } catch (error) {
      console.log(error.message);
    }
  };
  place_order = async (req, res) => {
    const { price, products, delivery_cost, shippingInfo, userId } = req.body;
    let adminOrderData = [];
    let cartId = [];
    const tempDate = moment(Date.now()).format("LLL");

    let customerOrderProduct = [];
    for (let i = 0; i < products.length; i++) {
      const pro = products[i].products;
      for (let j = 0; j < pro.length; j++) {
        let tempCusPro = pro[j].productInfo;
        customerOrderProduct.push(tempCusPro);
        if (pro[j]._id) {
          cartId.push(pro[j]._id);
        }
      }
    }
    try {
      const order = await customerOrderModal.create({
        customerId: userId,
        shippingInfo,
        products: customerOrderProduct,
        price: price + delivery_cost,
        delivery_status: "pending",
        payment_status: "unpaid",
        date: tempDate,
      });
      // products formate like kun shop e koita products cart hoiche sheita seller and admin er kache pathano
      for (let i = 0; i < products.length; i++) {
        const pro = products[i].products;
        const pri = products[i].price;
        const sellerId = products[i].sellerId;
        let storePro = [];
        for (let j = 0; j < pro.length; j++) {
          let tempPro = pro[j].productInfo;
          tempPro.quantity = pro[j].quantity;
          storePro.push(tempPro);
        }
        // author or er kache product update
        adminOrderData.push({
          orderId: order.id,
          sellerId,
          products: storePro,
          price: pri,
          payment_status: "unpaid",
          shippingInfo: "admin ware shop house",
          delivery_status: "pending",
          date: tempDate,
        });
      }
      await adminOrderModal.insertMany(adminOrderData);
      // cart order remove
      for (let k = 0; k < cartId.length; k++) {
        await cartModal.findById(cartId[k]);
      }
      setTimeout(() => {
        this.paymentCheck(order.id);
      }, 15000);
      responseReturn(res, 201, {
        message: "order place success",
        orderId: order.id,
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  get_customer_dashboard_data = async (req, res) => {
    const { userId } = req.params;

    try {
      const recentOrders = await customerOrderModal
        .find({
          customerId: new ObjectId(userId),
        })
        .limit(5);
      const pendingOrder = await customerOrderModal
        .find({
          customerId: new ObjectId(userId),
          delivery_status: "pending",
        })
        .countDocuments();

      const totalOrder = await customerOrderModal
        .find({
          customerId: new ObjectId(userId),
        })
        .countDocuments();
      const cancelledOrder = await customerOrderModal
        .find({
          customerId: new ObjectId(userId),
          delivery_status: "cancelled",
        })
        .countDocuments();
      responseReturn(res, 200, {
        recentOrders,
        pendingOrder,
        cancelledOrder,
        totalOrder,
      });
    } catch (error) {
      console.log(error.message);
    }
    
  };

  get_orders = async (req, res) => {
    const { customerId, status } = req.params;
    try {
      let orders = [];
      if (status !== "all") {
        orders = await customerOrderModal.find({
          customerId: new ObjectId(customerId),
          delivery_status: status,
        });
      } else {
        orders = await customerOrderModal.find({
          customerId: new ObjectId(customerId),
        });
      }
      responseReturn(res, 200, {
        orders,
      });
    } catch (error) {
      console.log(error.message);
    }
  };
  get_order_details = async (req, res) => {
    const { orderId } = req.params;
    try {
      const order = await customerOrderModal.findById(orderId);
      responseReturn(res, 200, {
        order,
      });
    } catch (error) {
      console.log(error.message);
    }
  };
}

module.exports = new orderController();
