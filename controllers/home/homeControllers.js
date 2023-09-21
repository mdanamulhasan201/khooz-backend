const categoryModal = require("../../models/categoryModal");
const productModal = require("../../models/productModal");
const { responseReturn } = require("../../utiles/response");
const queryProducts = require("../../utiles/queryProducts");

class homeControllers {
  get_categorys = async (req, res) => {
    try {
      const categorys = await categoryModal.find({});
      responseReturn(res, 200, {
        categorys,
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  get_products = async (req, res) => {
    try {
      const products = await productModal.find({}).limit(8).sort({
        createdAt: -1,
      });
      const latest_product = await productModal.find({}).limit(8).sort({
        createdAt: -1,
      });

      const topRated_product = await productModal.find({}).limit(8).sort({
        rating: -1,
      });

      const discount_product = await productModal.find({}).limit(8).sort({
        discount: -1,
      });

      responseReturn(res, 200, {
        products,
        latest_product,
        topRated_product,
        discount_product,
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  price_range_product = async (req, res) => {
    try {
      const priceRange = {
        low: 0,
        high: 0,
      };
      const latest_product = await productModal.find({}).limit(4).sort({
        createdAt: -1,
      });
      const getForPrice = await productModal.find({}).sort({
        price: 1,
      });
      if (getForPrice.length > 0) {
        priceRange.high = getForPrice[getForPrice.length - 1].price;
        priceRange.low = getForPrice[0].price;
      }
      responseReturn(res, 200, {
        latest_product,
        priceRange,
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  query_products = async (req, res) => {
    const parPage = 12;
    req.query.parPage = parPage;
    
    try {
      const products = await productModal.find({}).sort({
        createdAt: -1,
      });
      const totalProduct = new queryProducts(products, req.query)
        .categoryQuery()
        .searchQuery()
        .priceQuery()
        .sortByPrice()
        .countProducts();

      const result = new queryProducts(products, req.query)
        .categoryQuery()
        .searchQuery()
        .priceQuery()
        .sortByPrice()
        .skip()
        .limit()
        .getProducts();

      responseReturn(res, 200, {
        products: result,
        totalProduct,
        parPage,
      });
    } catch (error) {
      console.log(error.message);
    }
  };
}

module.exports = new homeControllers();
