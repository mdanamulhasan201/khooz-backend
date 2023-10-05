const categoryModal = require("../../models/categoryModal");
const productModal = require("../../models/productModal");
const { responseReturn } = require("../../utiles/response");
const queryProducts = require("../../utiles/queryProducts");
const reviewModal = require("../../models/reviewModal");
const moment = require("moment/moment");
const {
  mongo: { ObjectId },
} = require("mongoose");
const providerReviewModal = require("../../models/providerReviewModal");
const sellerModal = require("../../models/sellerModal");

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

  get_product_details = async (req, res) => {
    const { slug } = req.params;
    try {
      const product = await productModal.findOne({ slug });
      const moreProducts = await productModal
        .find({
          $and: [
            {
              _id: {
                $ne: product.id,
              },
            },
            {
              sellerId: {
                $eq: product.sellerId,
              },
            },
          ],
        })
        .limit(3);
      responseReturn(res, 200, { product, moreProducts });
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

  // review products

  customer_review = async (req, res) => {
    const { name, rating, review, productId } = req.body;
    try {
      await reviewModal.create({
        productId,
        name,
        rating,
        review,
        date: moment(Date.now()).format("LL"),
      });

      let rat = 0;
      const reviews = await reviewModal.find({ productId });
      for (let i = 0; i < reviews.length; i++) {
        rat = rat + reviews[i].rating;
      }
      let productRating = 0;
      if (reviews.length !== 0) {
        productRating = (rat / reviews.length).toFixed(1);
      }
      await productModal.findByIdAndUpdate(productId, {
        rating: productRating,
      });
      responseReturn(res, 201, { message: "Review Success" });
    } catch (error) {
      console.log(error.message);
    }
  };

  get_reviews = async (req, res) => {
    const { productId } = req.params;
    // let { pageNo } = req.query;
    // pageNo = parseInt(pageNo);
    // const limit = 5;
    // const skipPage = limit * (pageNo - 1);
    try {
      let getRating = await reviewModal.aggregate([
        {
          $match: {
            productId: {
              $eq: new ObjectId(productId),
            },
            rating: {
              $not: {
                $size: 0,
              },
            },
          },
        },
        {
          $unwind: "$rating",
        },
        {
          $group: {
            _id: "$rating",
            count: {
              $sum: 1,
            },
          },
        },
      ]);
      let rating_review = [
        {
          rating: 5,
          sum: 0,
        },
        {
          rating: 4,
          sum: 0,
        },
        {
          rating: 3,
          sum: 0,
        },
        {
          rating: 2,
          sum: 0,
        },
        {
          rating: 1,
          sum: 0,
        },
      ];
      for (let i = 0; i < rating_review.length; i++) {
        for (let j = 0; j < getRating.length; j++) {
          if (rating_review[i].rating === getRating[j]._id) {
            rating_review[i].sum = getRating[j].count;
            break;
          }
        }
      }
      const getAll = await reviewModal.find({
        productId,
      });
      const reviews = await reviewModal.find({
        productId,
      });
      // .skip(skipPage)
      // .limit(limit)
      // .sort({
      //   createdAt: -1,
      // });
      responseReturn(res, 200, {
        reviews,
        totalReview: getAll.length,
        rating_review,
      });
    } catch (error) {
      console.log(error);
    }
  };

  provider_review = async (req, res) => {
    const { name, rating, review, sellerId } = req.body;

    try {
      await providerReviewModal.create({
        sellerId,
        name,
        rating,
        review,
        date: moment(Date.now()).format("LL"),
      });

      let rat = 0;
      const reviews = await providerReviewModal.find({ sellerId });
      for (let i = 0; i < reviews.length; i++) {
        rat = rat + reviews[i].rating;
      }
      let providerRating = 0;
      if (reviews.length !== 0) {
        providerRating = (rat / reviews.length).toFixed(1);
      }
      await sellerModal.findByIdAndUpdate(sellerId, {
        rating: providerRating,
      });
      responseReturn(res, 201, { message: "Review Success" });
    } catch (error) {
      console.log(error.message);
    }
  };

  get_provider_reviews = async (req, res) => {
    const { sellerId } = req.params;
    // let { pageNo } = req.query;
    // pageNo = parseInt(pageNo);
    // const limit = 5;
    // const skipPage = limit * (pageNo - 1);

    try {
      let getRating = await providerReviewModal.aggregate([
        {
          $match: {
            sellerId: {
              $eq: new ObjectId(sellerId),
            },
            rating: {
              $not: {
                $size: 0,
              },
            },
          },
        },
        {
          $unwind: "$rating",
        },
        {
          $group: {
            _id: "$rating",
            count: {
              $sum: 1,
            },
          },
        },
      ]);
      let rating_reviews = [
        {
          rating: 5,
          sum: 0,
        },
        {
          rating: 4,
          sum: 0,
        },
        {
          rating: 3,
          sum: 0,
        },
        {
          rating: 2,
          sum: 0,
        },
        {
          rating: 1,
          sum: 0,
        },
      ];
      for (let i = 0; i < rating_reviews.length; i++) {
        for (let j = 0; j < getRating.length; j++) {
          if (rating_reviews[i].rating === getRating[j]._id) {
            rating_reviews[i].sum = getRating[j].count;
            break;
          }
        }
      }
      const getAll = await providerReviewModal.find({
        sellerId,
      });
      const reviewss = await providerReviewModal.find({
        sellerId,
      });
      // .skip(skipPage)
      // .limit(limit)
      // .sort({
      //   createdAt: -1,
      // });
    
      responseReturn(res, 200, {
        reviewss,
        totalReviews: getAll.length,
        rating_reviews,
      });
    } catch (error) {
      console.log(error);
    }
  };
}

module.exports = new homeControllers();
