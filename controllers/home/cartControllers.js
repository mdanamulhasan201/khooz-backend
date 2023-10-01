const cartModal = require("../../models/cartModal");
const wishlistModal = require("../../models/wishlistModal");
const { responseReturn } = require("../../utiles/response");
const {
  mongo: { ObjectId },
} = require("mongoose");

class cartControllers {
  add_to_cart = async (req, res) => {
    const { userId, productId, quantity } = req.body;
    try {
      const product = await cartModal.findOne({
        $and: [
          {
            productId: {
              $eq: productId,
            },
          },
          {
            userId: {
              $eq: userId,
            },
          },
        ],
      });
      if (product) {
        responseReturn(res, 404, { error: "Already added to cart" });
      } else {
        const product = await cartModal.create({
          userId,
          productId,
          quantity,
        });
        responseReturn(res, 201, { message: "Add to success", product });
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  //   cart products and calculate
  get_cart_products = async (req, res) => {
    const commition = 2;
    const { userId } = req.params;
    try {
      const cart_products = await cartModal.aggregate([
        {
          $match: {
            userId: {
              $eq: new ObjectId(userId),
            },
          },
        },
        {
          $lookup: {
            from: "products",
            localField: "productId",
            foreignField: "_id",
            as: "products",
          },
        },
      ]);
      let buy_product_item = 0;
      let calculatePrice = 0;
      let cart_product_count = 0;
      const outOfStockProducts = cart_products.filter(
        (p) => p.products[0].stock < p.quantity
      );
      for (let i = 0; i < outOfStockProducts.length; i++) {
        cart_product_count =
          cart_product_count + outOfStockProducts[i].quantity;
      }
      const stockProduct = cart_products.filter(
        (p) => p.products[0].stock >= p.quantity
      );
      for (let i = 0; i < stockProduct.length; i++) {
        const { quantity } = stockProduct[i];
        cart_product_count = cart_product_count + quantity;
        buy_product_item = buy_product_item + quantity;
        const { price, discount } = stockProduct[i].products[0];
        if (discount !== 0) {
          calculatePrice =
            calculatePrice +
            quantity * (price - Math.floor((price * discount) / 100));
        } else {
          calculatePrice = calculatePrice + quantity * price;
        }
      }
      //   product formate
      let p = [];

      let unique = [
        ...new Set(stockProduct.map((p) => p.products[0].sellerId.toString())),
      ];
      for (let i = 0; i < unique.length; i++) {
        let price = 0;
        for (let j = 0; j < stockProduct.length; j++) {
          const tempProducts = stockProduct[j].products[0];
          if (unique[i] === tempProducts.sellerId.toString()) {
            let pri = 0;
            if (tempProducts.discount !== 0) {
              pri =
                tempProducts.price -
                Math.floor((tempProducts.price * tempProducts.discount) / 100);
            } else {
              pri = tempProducts.price;
            }
            // commition calculate
            pri = pri - Math.floor((pri * commition) / 100);
            price = price + pri * stockProduct[j].quantity;
            // card style
            p[i] = {
              sellerId: unique[i],
              shopName: tempProducts.shopName,
              price,
              products: p[i]
                ? [
                    ...p[i].products,
                    {
                      _id: stockProduct[j]._id,
                      quantity: stockProduct[j].quantity,
                      productInfo: tempProducts,
                    },
                  ]
                : [
                    {
                      _id: stockProduct[j]._id,
                      quantity: stockProduct[j].quantity,
                      productInfo: tempProducts,
                    },
                  ],
            };
          }
        }
      }

      responseReturn(res, 200, {
        cart_products: p,
        price: calculatePrice,
        cart_product_count,
        delivery_cost: 100 * p.length,
        outOfStockProducts,
        buy_product_item,
      });
      //   console.log(p);
      //   console.log(calculatePrice);
      //   console.log(outOfStockProducts);

      //   console.log(calculatePrice);
    } catch (error) {
      console.log(error.message);
    }
  };

  delete_cart_product = async (req, res) => {
    const { cartId } = req.params;
    try {
      await cartModal.findByIdAndDelete(cartId);
      responseReturn(res, 200, { message: "Delete success" });
    } catch (error) {
      console.log(error.message);
    }
  };
  quantity_increment = async (req, res) => {
    const { cartId } = req.params;
    // console.log(cartId);
    try {
      const product = await cartModal.findById(cartId);
      const { quantity } = product;
      await cartModal.findByIdAndUpdate(cartId, {
        quantity: quantity + 1,
      });
      responseReturn(res, 200, { message: "Quantity add" });
    } catch (error) {
      console.log(error.message);
    }
  };
  quantity_decrement = async (req, res) => {
    const { cartId } = req.params;
    try {
      const product = await cartModal.findById(cartId);
      const { quantity } = product;
      await cartModal.findByIdAndUpdate(cartId, {
        quantity: quantity - 1,
      });
      responseReturn(res, 200, { message: "Quantity minus" });
    } catch (error) {
      console.log(error.message);
    }
  };

  // add to wishlist
  add_to_wishlist = async (req, res) => {
    const { slug } = req.body;
    try {
      const product = await wishlistModal.findOne({ slug });
      if (product) {
        responseReturn(res, 404, { error: "Already added" });
      } else {
        await wishlistModal.create(req.body);
        responseReturn(res, 201, { message: "add to wishlist success" });
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  // get wishlist
  get_wishlist_products = async (req, res) => {
    const { userId } = req.params;
    try {
      // const wishlistCount = await wishlistModal.find({userId}).countDocuments()
      const wishlists = await wishlistModal.find({ userId });
      responseReturn(res, 200, { wishlistCount: wishlists.length, wishlists });
    } catch (error) {
      console.log(error.message);
    }
  };
  // removed wishlist
  remove_wishlist = async (req, res) => {
    const { wishlistId } = req.params;
    try {
      const wishlist = await wishlistModal.findByIdAndDelete(wishlistId);
      responseReturn(res, 200, {
        message: "Remove wishlist",
        wishlistId,
        wishlist
      });
    } catch (error) {
      console.log(error.message);
    }
  };
}
module.exports = new cartControllers();
