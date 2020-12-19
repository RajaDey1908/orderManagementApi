import Product from "../../Models/Product";

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
      .json({ data: products, msg: "Product List found successfully", ack:1 });
  } catch (err) {
    console.log("Error => ", err.message);
    res.status(500).json({ msg: "Something went wrong.." });
  }
};
export default { createProduct, listsProduct };
