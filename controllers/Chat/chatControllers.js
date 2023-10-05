const CustomerModal = require("../../models/CustomerModal");
const SellerCustomerModal = require("../../models/chat/SellerCustomerModal");
const sellerCustomerMessage = require("../../models/chat/sellerCustomerMessage");

const sellerModal = require("../../models/sellerModal");
const { responseReturn } = require("../../utiles/response");

class chatControllers {
  add_customer_friend = async (req, res) => {
    console.log(req.body);
    const { sellerId, userId } = req.body;
    try {
      if (sellerId !== "") {
        const seller = await sellerModal.findById(sellerId);
        const user = await CustomerModal.findById(userId);

        // add seller in customer chat list
        const checkSeller = await SellerCustomerModal.findOne({
          $and: [
            {
              myId: {
                $eq: userId,
              },
            },
            {
              myFriends: {
                $elemMatch: {
                  fdId: sellerId,
                },
              },
            },
          ],
        });

        if (!checkSeller) {
          await SellerCustomerModal.updateOne(
            {
              myId: userId,
            },
            {
              $push: {
                myFriends: {
                  fdId: sellerId,
                  name: seller.shopInfo?.shopName,
                  image: seller.image,
                },
              },
            }
          );
        }

        // add customer in seller chat list
        // const checkCustomer = await SellerCustomerModal.findOne({
        //   $and: [
        //     {
        //       myId: {
        //         $eq: sellerId,
        //       },
        //     },
        //     {
        //       myFriends: {
        //         $elemMatch: {
        //           fdId: userId,
        //         },
        //       },
        //     },
        //   ],
        // });

        // if (!checkCustomer) {
        //   await SellerCustomerModal.updateOne(
        //     {
        //       myId: sellerId,
        //     },
        //     {
        //       $push: {
        //         myFriends: {
        //           fdId: sellerId,
        //           fdId: seller.shopInfo?.shopName,
        //           image: seller.image,
        //           //   image: user.image,
        //         },
        //       },
        //     }
        //   );
        // }

        //  message

        // const message = await

        const messages = await sellerCustomerMessage({
          $or: [
            {
              $and: [
                {
                  receiverId: { $eq: sellerId },
                },
                {
                  senderId: { $eq: userId },
                },
              ],
            },
            {
              $and: [
                {
                  receiverId: { $eq: userId },
                },
                {
                  senderId: { $eq: sellerId },
                },
              ],
            },
          ],
        });
        const MyFriends = await SellerCustomerModal.findOne({ myId: userId });
        const currentFriend = MyFriends.myFriends.find(
          (s) => s.fdId === sellerId
        );
        responseReturn(res, 200, {
          myFriends: MyFriends.myFriends,
          currentFriend,
          messages,
        });
      } else {
        const MyFriends = await SellerCustomerModal.findOne({ myId: userId });
        responseReturn(res, 200, { myFriends: MyFriends.myFriends });
      }
    } catch (error) {
      console.log(error);
    }
  };
}

module.exports = new chatControllers();
