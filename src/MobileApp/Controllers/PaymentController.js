const paypal = require("paypal-rest-sdk");
var httpBuildQuery = require("http-build-query");
var md5 = require("md5");

let baseUrl = "http://192.168.1.105:5029";

paypal.configure({
  mode: "sandbox", //sandbox or live
  client_id:
    "AUImjcuqgI-qU60LSHPRSYT6zYejsKNErOy6Qx4AJVlvtQkEFSZ2xFVlpiXEAH79aGx19Rma8Ki-arCc",
  client_secret:
    "EJGQInp4GrJ882TQZOaxAyOk05fjBcQ73wIm1KVNu-YqlE5xUZo82hfknbFlgEyr0bHrrFEwFh3I8WqZ"
});

// Alipay Payment Gateway Credential
// let _partner_id = "2088101122136241";
// let _key = "760bdzec6y9goq7ctyx96ezkz78287de";

// // let _partner_id = "2088122814898623";
// // let _key = "h3r9odtmavj3qbd0cjz70l8il9urgnst";  
// let _endpoint = "https://openapi.alipaydev.com/gateway.do";
// let sale_id = makeid(13);
// let amount = 10.25;
// let currency = "USD";
// let description = "A pair of shoes";
// let uuid = "5f240ad1e48c3";
// let return_url = baseUrl+"/app/payment/return/";
// let notify_url = baseUrl+"/app/payment/notify/";
// let is_mobile = false;

// function _sign(newData) {
//   let query = "";
//   Object.keys(newData).map(function (key, index) {
//     query = query + key + "=" + newData[key] + "&";
//   });
//   query = query.substring(0, query.length - 1);
//   return md5(query + _key);
// }

function ksort(obj) {
  var keys = Object.keys(obj).sort(),
    sortedObj = {};

  for (var i in keys) {
    sortedObj[keys[i]] = obj[keys[i]];
  }

  return sortedObj;
}

function makeid(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

/** Paypal Home Page */
const paypalHome = async (req, res) => {
  //   console.log("in paypal");
  res.render("pages/Paypal/payment");
};

/** Paypal Action Page */
const paypalAction = async (req, res) => {
  //   console.log("in paypalAction");
  var create_payment_json = {
    intent: "sale",
    payer: {
      payment_method: "paypal"
    },
    redirect_urls: {
      return_url: baseUrl + "/app/payment/success",
      cancel_url: baseUrl + "/app/payment/cancel"
    },
    transactions: [
      {
        item_list: {
          items: [
            {
              name: "item",
              sku: "item",
              price: "1.00",
              currency: "USD",
              quantity: 1
            }
          ]
        },
        amount: {
          currency: "USD",
          total: "1.00"
        },
        description: "This is the payment description."
      }
    ]
  };

  paypal.payment.create(create_payment_json, function (error, payment) {
    if (error) {
      throw error;
    } else {
      //   console.log("Create Payment Response");
      //   console.log(payment);
      res.redirect(payment.links[1].href);
    }
  });
};

/** Paypal Success Return */
const success = async (req, res) => {
  //   console.log("in success");
  // res.send("Success");
  var PayerID = req.query.PayerID;
  var paymentId = req.query.paymentId;
  var execute_payment_json = {
    payer_id: PayerID,
    transactions: [
      {
        amount: {
          currency: "USD",
          total: "1.00"
        }
      }
    ]
  };

  paypal.payment.execute(paymentId, execute_payment_json, function (
    error,
    payment
  ) {
    if (error) {
      console.log(error.response);
      throw error;
    } else {
      //   console.log("Get Payment Response");
      //   console.log(payment);
      // console.log(JSON.stringify(payment));
      res.render("pages/Paypal/success");
    }
  });
};

/** Paypal Cancel Return */
const cancel = async (req, res) => {
  //   console.log("in cancel");
  res.render("pages/Paypal/cancel");
};

/** Alipay Integration Using My Credentials */
const alipay = async (req, res) => {

  let _partner_id = "2088101122136241";
  let _key = "760bdzec6y9goq7ctyx96ezkz78287de";

  // let _partner_id = "2088122814898623";
  // let _key = "h3r9odtmavj3qbd0cjz70l8il9urgnst";  
  let _endpoint = "https://openapi.alipaydev.com/gateway.do";
  let sale_id = makeid(13);
  let amount = 10.25;
  let currency = "USD";
  let description = "A pair of shoes";
  let uuid = "5f240ad1e48c3";
  let return_url = baseUrl + "/app/payment/return/";
  let notify_url = baseUrl + "/app/payment/notify/";
  let is_mobile = false;

  function _sign(newData) {
    let query = "";
    Object.keys(newData).map(function (key, index) {
      query = query + key + "=" + newData[key] + "&";
    });
    query = query.substring(0, query.length - 1);
    return md5(query + _key);
  }


  console.log("in alipay");
  let data = [];
  data["body"] = description;
  (data["service"] = is_mobile
    ? "create_forex_trade_wap"
    : "create_forex_trade"),
    (data["out_trade_no"] = sale_id);
  data["currency"] = currency;
  data["total_fee"] = amount;
  data["subject"] = description;
  data["return_url"] = return_url;
  data["notify_url"] = notify_url;
  data["partner"] = _partner_id;
  data["_input_charset"] = "utf-8";

  let objectData = Object.assign({}, data);
  let newData = ksort(objectData);
  let signinValue = _sign(newData);

  data["sign"] = signinValue;
  data["sign_type"] = "MD5";

  let finalData = httpBuildQuery(data);
  let finalUrl = _endpoint + "?" + finalData;
  console.log("finalUrl", finalUrl);
  res.render("pages/Alipay/payment", { finalUrl: finalUrl });
};



/** Alipay Integration  using Client credentials*/
const alipayClient = async (req, res) => {

  let _partner_id = "2021001188691485";
  let _key = "h3r9odtmavj3qbd0cjz70l8il9urgnst";  
  let _endpoint = "https://openapi.alipaydev.com/gateway.do";
  let sale_id = makeid(13);
  let amount = 10.25;
  let currency = "USD";
  let description = "A pair of shoes";
  let uuid = "5f240ad1e48c3";
  let return_url = baseUrl + "/app/payment/return/";
  let notify_url = baseUrl + "/app/payment/notify/";
  let is_mobile = false;

  function _sign(newData) {
    let query = "";
    Object.keys(newData).map(function (key, index) {
      query = query + key + "=" + newData[key] + "&";
    });
    query = query.substring(0, query.length - 1);
    return md5(query + _key);
  }
  
  
  console.log("in alipay");
  let data = [];
  data["body"] = description;
  (data["service"] = is_mobile
    ? "create_forex_trade_wap"
    : "create_forex_trade"),
    (data["out_trade_no"] = sale_id);
  data["currency"] = currency;
  data["total_fee"] = amount;
  data["subject"] = description;
  data["return_url"] = return_url;
  data["notify_url"] = notify_url;
  data["partner"] = _partner_id;
  data["_input_charset"] = "utf-8";

  let objectData = Object.assign({}, data);
  let newData = ksort(objectData);
  let signinValue = _sign(newData);

  data["sign"] = signinValue;
  data["sign_type"] = "MD5";

  let finalData = httpBuildQuery(data);
  let finalUrl = _endpoint + "?" + finalData;
  console.log("finalUrl", finalUrl);
  res.render("pages/Alipay/payment", { finalUrl: finalUrl });
};

/** Alipay Notify */
const alipayNotify = async (req, res) => {
  console.log("in alipay");
  res.json({
    msg: " notify"
  });
};

/** Alipay Return */
const alipayReturn = async (req, res) => {
  console.log("in alipay");
  res.json({
    msg: " return"
  });
};

export default {
  paypalHome,
  paypalAction,
  success,
  cancel,
  alipay,
  alipayNotify,
  alipayReturn,
  alipayClient
};
