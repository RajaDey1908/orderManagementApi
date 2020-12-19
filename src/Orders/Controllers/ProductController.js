import Car from "../../Models/Car";
import Product from "../../Models/Product";
import config from "../../../config/config";
import mongoose from "mongoose";

/**
 * createProduct
 * @param req body
 * @returns JSON
 */
const createProduct = async (req, res) => {
  if (
    req.body.productId == null ||
    req.body.name == null ||
    req.body.price == null ||
    req.body.expiry == null
  ) {
    return res.status(400).json({ msg: "Parameter missing!!!" });
  }
  try {
    const allData = req.body;
    const addCar = await new Product(allData).save();
    res.status(200).json({ msg: "Car added successfully" });
  } catch (err) {
    console.log("Error => ", err.message);
    res.status(500).json({ msg: "Something went wrong." });
  }
};

/**
 * listsProduct
 * @param req body
 * @returns json
 */
const listsProduct = async (req, res) => {
  try {
    console.log("dfd dfi");
    let filterData = {
      isActive: true,
      isDeleted: false,
    };
    let limit = 5;
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
      { $limit: limit },
    ]);
    res
      .status(200)
      .json({ data: products, msg: "Product List found successfully" });
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
    filterDate.setDate(filterDate.getDate() - 7);

    let filterData = {
      isActive: true,
      isDeleted: false,
      createdDate: { $gt: filterDate },
    };
    let limit = 20;
    const products = await Product.aggregate([
      {
        $match: filterData,
      },
      { $sort: { createdDate: -1 } },
      { $limit: limit },
    ]);
    console.log("products.len", products.length);
    res
      .status(200)
      .json({ data: products, msg: "Product List found successfully" });
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
export default { createProduct, listsProduct, TopSaleProduct, CurrentProduct };
