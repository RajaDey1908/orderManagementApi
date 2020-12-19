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
      .json({
        data: orderDetails,
        msg: "Top Product List Found successfully",
        ack: 1,
      });
  } catch (err) {
    console.log("Error => ", err.message);
    res.status(500).json({ msg: "Something went wrong..", ack: 0 });
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

    const productsLast = await Order.aggregate([
      //   {
      //     $match: filterDataLast,
      //   },
      {
        $match: {
          isActive: true,
          isDeleted: false,
          // createdDate: { $gt: lastMonthFirstDay, $lt: lastMonthLastDay },
        },
      },
      {
        $group: {
          _id: null,
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
    ]);

    let filterDataFirstPrevious = {
      isActive: true,
      isDeleted: false,
      createdDate: { $gt: firstPreviousfirstDay, $lt: firstPreviouslastDay },
    };
    const productsFirstPrevious = await Order.aggregate([
      //   {
      //     $match: filterDataFirstPrevious,
      //   },
      {
        $match: {
          isActive: true,
          isDeleted: false,
          // createdDate: { $gt: firstPreviousfirstDay, $lt: firstPreviouslastDay },
        },
      },
      {
        $group: {
          _id: null,
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
    ]);

    let filterDataSecondPrevious = {
      isActive: true,
      isDeleted: false,
      createdDate: { $gt: secondPreviousfirstDay, $lt: secondPreviouslastDay },
    };
    const productsSecondPrevious = await Order.aggregate([
      //   {
      //     $match: filterDataSecondPrevious,
      //   },
      {
        $match: {
          isActive: true,
          isDeleted: false,
          // createdDate: { $gt: secondPreviousfirstDay, $lt: secondPreviouslastDay },
        },
      },
      {
        $group: {
          _id: null,
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
    ]);

    let products = {
      productsLast,
      productsFirstPrevious,
      productsSecondPrevious,
    };
    res
      .status(200)
      .json({ data: products, msg: "Product List found successfully", ack: 1 });
  } catch (err) {
    console.log("Error => ", err.message);
    res.status(500).json({ msg: "Something went wrong..", ack: 0 });
  }
};

/**
 * SaleRatio
 * @param req body
 * @returns json
 */
const SaleRatio = async (req, res) => {
  try {
    const totalAmount = await Order.aggregate([
      {
        $match: {
          isActive: true,
          isDeleted: false,
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: {
            $sum: {
              $toDouble: "$salePrice",
            },
          },
        },
      },
    ]);

    const highestSellingProduct = await Order.aggregate([
      {
        $match: {
          isActive: true,
          isDeleted: false,
        },
      },
      {
        $group: {
          _id: "$productId",
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
      { $limit: 1 },
    ]);

    const lowestSellingProduct = await Order.aggregate([
      {
        $match: {
          isActive: true,
          isDeleted: false,
        },
      },
      {
        $group: {
          _id: "$productId",
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
      { $sort: { count: 1 } },
      { $limit: 1 },
    ]);

    let finalData = {
      totalAmount,
      highestSellingProduct,
      lowestSellingProduct,
    };

    res
      .status(200)
      .json({ data: finalData, msg: "Product Sale Ratio", ack: 1 });
  } catch (err) {
    console.log("Error => ", err.message);
    res.status(500).json({ msg: "Something went wrong..", ack: 1 });
  }
};

export default { createOrder, TopSaleProduct, CurrentProduct, SaleRatio };
