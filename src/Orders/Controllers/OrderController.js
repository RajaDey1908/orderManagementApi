import Car from "../../Models/Car";
import Product from "../../Models/Product";
import Order from "../../Models/Order";
import config from "../../../config/config";
import mongoose from "mongoose";

/**
 * createOrder
 * @param req body
 * @returns JSON
 */
const createOrder = async (req, res) => {
  if (
    req.body.orderDate == null ||
    req.body.productId == null ||
    req.body.salePrice == null
  ) {
    return res.status(400).json({ msg: "Parameter missing!!!", ack: 0 });
  }
  try {
    const allData = req.body;
    console.log("allData", allData);
    const addCar = await new Order(allData).save();
    res.status(200).json({ msg: "Order Added Successfully", ack: 1 });
  } catch (err) {
    console.log("Error => ", err.message);
    res.status(500).json({ msg: "Something Went Wrong.", ack: 0 });
  }
};

/**
 * listsProduct
 * @param req body
 * @returns json
 */
const listsProduct = async (req, res) => {
  var filterDate = new Date();
  try {
    let filterData = {
      isActive: true,
      isDeleted: false,
      expiry: { $gt: filterDate },
    };
    // let limit = 5;
    // let page = req.query.page;
    // let skip = (limit * page);
    const products = await Product.aggregate([
      {
        $match: filterData,
      },
      //   {
      //     $lookup: {
      //       from: "users",
      //       localField: "userId",
      //       foreignField: "_id",
      //       as: "userDetails",
      //     },
      //   },
      { $sort: { createdDate: -1 } },
      //   { $limit: limit },
    ]);
    res
      .status(200)
      .json({ data: products, msg: "Product List found successfully", ack: 1 });
  } catch (err) {
    console.log("Error => ", err.message);
    res.status(500).json({ msg: "Something went wrong.." });
  }
};

/**
 * TopSaleProduct
 * @param req body
 * @returns json
 */
const TopSaleProduct = async (req, res) => {
  try {
    var filterDate = new Date();
    let endDate = new Date();
    filterDate.setDate(filterDate.getDate() - 7);
    let startDate = filterDate;

    // let filterData = {
    //   isActive: true,
    //   isDeleted: false,
    //   //   createdDate: { $gt: filterDate },
    // };
    console.log("endDate", endDate);
    console.log("startDate", startDate);
    let limit = 20;
    const orderDetails = await Order.aggregate([
      {
        $match: {
          isActive: true,
          isDeleted: false,
          createdDate: { $gt: startDate, $lt: endDate },
        },
      },
      {
        $group: {
          _id: "$productId",
          //   count: { $sum: 1 },
          //   total: {
          //     $sum: "$salePrice",
          //   },
          totalAmount: {
            $sum: {
              $toDouble: "$salePrice",
            },
          },
          count: {
            $sum: 1,
          },
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      { $sort: { count: -1 } },
      { $limit: limit },
    ]);

    // for (let i = 0; i < orderDetails.length; i++) {
    //   const productDetails = await Product.find({
    //     _id: mongoose.Types.ObjectId(orderDetails[i]._id),
    //   });
    //   orderDetails[i]["productDetails"] = productDetails;
    // }

    res
      .status(200)
      .json({ data: orderDetails, msg: "Top Product List Found successfully" });
  } catch (err) {
    console.log("Error => ", err.message);
    res.status(500).json({ msg: "Something went wrong.." });
  }
};

/**
 * CurrentProduct
 * @param req body
 * @returns json
 */
const CurrentProduct = async (req, res) => {
  try {
    var date = new Date();
    var lastMonthFirstDay = new Date(
      date.getFullYear(),
      date.getMonth() - 1,
      1
    );
    var lastMonthLastDay = new Date(date.getFullYear(), date.getMonth(), 1);

    var firstPreviousfirstDay = new Date(
      date.getFullYear(),
      date.getMonth() - 2,
      1
    );
    var firstPreviouslastDay = new Date(
      date.getFullYear(),
      date.getMonth() - 1,
      1
    );

    var secondPreviousfirstDay = new Date(
      date.getFullYear(),
      date.getMonth() - 3,
      1
    );
    var secondPreviouslastDay = new Date(
      date.getFullYear(),
      date.getMonth() - 2,
      1
    );

    let filterDataLast = {
      isActive: true,
      isDeleted: false,
      createdDate: { $gt: lastMonthFirstDay, $lt: lastMonthLastDay },
    };

    const productsLast = await Product.aggregate([
      {
        $match: filterDataLast,
      },
    ]);

    let filterDataFirstPrevious = {
      isActive: true,
      isDeleted: false,
      createdDate: { $gt: firstPreviousfirstDay, $lt: firstPreviouslastDay },
    };
    const productsFirstPrevious = await Product.aggregate([
      {
        $match: filterDataFirstPrevious,
      },
    ]);

    let filterDataSecondPrevious = {
      isActive: true,
      isDeleted: false,
      createdDate: { $gt: secondPreviousfirstDay, $lt: secondPreviouslastDay },
    };
    const productsSecondPrevious = await Product.aggregate([
      {
        $match: filterDataSecondPrevious,
      },
    ]);

    let products = {
      productsLast,
      productsFirstPrevious,
      productsSecondPrevious,
    };
    res
      .status(200)
      .json({ data: products, msg: "Product List found successfully" });
  } catch (err) {
    console.log("Error => ", err.message);
    res.status(500).json({ msg: "Something went wrong.." });
  }
};
export default { createOrder, listsProduct, TopSaleProduct, CurrentProduct };
