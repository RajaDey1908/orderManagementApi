import User from "../../Models/User";
import EmailTemplate from "../../Models/EmailTemplate";
import ContactUs from "../../Models/ContactUs";
import config from "../../../config/config";
import nodemailer from "../../../config/nodemailer";
import Language from "../../Models/Language";
import Setting from "../../Models/Setting";
import mongoose from "mongoose";
import Core from "@alicloud/pop-core";
var client = new Core({
  accessKeyId: "LTAI4GCysgQPsCgat7pBXmE4",
  accessKeySecret: "n48zrgegoG4qLRNVr2CdNbToA21HTq",
  endpoint: "https://dysmsapi.aliyuncs.com",
  apiVersion: "2017-05-25",
});

/**
 * contactUs
 * @param req body
 * @returns JSON
 */
const contactUs = async (req, res) => {
  if (
    req.body.userId == null ||
    req.body.subject == null ||
    req.body.message == null
  ) {
    return res.status(400).json({ msg: "Parameter missing.." });
  }
  try {
    const user = await User.findById({ _id: req.body.userId });
    const settings = await Setting.findById({ _id: config.SETTING_PRIMARY_ID });
    const addData = await new ContactUs({
      userId: req.body.userId,
      subject: req.body.subject,
      message: req.body.message,
    }).save();
    const getTemplate = await EmailTemplate.findById({
      _id: config.CONTACT_US_PRIMARY_ID,
    });
    let to = settings.siteEmail;
    let subject = getTemplate.emailSubject;
    let emailContent = getTemplate.emailContent;
    let body = emailContent
      .replace("[EMAIL]", user.email)
      .replace("[SUBJECT]", req.body.subject)
      .replace("[MESSAGE]", req.body.message);
    const response = nodemailer.sendMail(subject, body, to);
    res.status(200).json({ msg: "Message sent successfully" });
  } catch (err) {
    console.log("Error => ", err.message);
    res.status(500).json({ msg: "Something went wrong." });
  }
};

/**
 * userMobileOTPSend
 * @param req body
 * @returns JSON
 */
const userMobileOTPSend = async (req, res) => {
  // if(req.body.countryCode == null || req.body.phoneNumber == null) {
  //     return res.status(400).json({msg:"Parameter missing!!!"});
  // }
  try {
    let userId = req.id;
    const user = await User.findById({ _id: userId });
    // let otp = "123456";
    var otp = Math.floor(Math.random() * 999999) + 100000;
    var otpObj = {
      code: otp,
    };
    // var number = "+8613537579531";
    var number = user.countryCode + "" + user.phoneNumber;
    var params = {
      RegionId: "cn-hangzhou",
      PhoneNumbers: number,
      SignName: "地球村远邻换车",
      TemplateCode: "SMS_196617471",
      TemplateParam: JSON.stringify(otpObj),
    };

    var requestOption = {
      method: "POST",
    };
    //Step 4
    const sendMessage = await client.request("SendSms", params, requestOption);
    console.log("sendMessage", sendMessage);
    if (sendMessage.Message == "OK") {
      const updateUser = await User.findByIdAndUpdate(
        { _id: userId },
        {
          $set: { otp: otp },
        }
      );
      res.status(200).json({ msg: "OTP sent successfully" });
    } else {
      res.status(200).json({ msg: "Invalid phone number" });
    }
  } catch (err) {
    console.log("Error => ", err.message);
    res.status(500).json({ msg: "Something went wrong." });
  }
};

/**
 * userMobileOTPVerification
 * @param req body
 * @returns JSON
 */
const userMobileOTPVerification = async (req, res) => {
  if (req.body.otp == null) {
    return res.status(400).json({ msg: "Parameter missing!!!" });
  }
  try {
    let userId = req.id;
    const user = await User.findById({ _id: userId });
    if (user && user.otp == req.body.otp) {
      const updateUser = await User.findByIdAndUpdate(
        { _id: userId },
        {
          $set: { isPhoneVerified: true },
        }
      );
      res.status(200).json({ msg: "Phone number verified" });
    } else {
      res.status(201).json({ msg: "OTP does not match" });
    }
  } catch (err) {
    console.log("Error => ", err.message);
    res.status(500).json({ msg: "Something went wrong." });
  }
};

/**
 * listsLanguage
 * @param req body
 * @returns JSON
 */
const listsLanguage = async (req, res) => {
  try {
    const data = await Language.find({
      isDeleted: false,
      isActive: true,
    });
    res.status(200).json({ data: data });
  } catch (err) {
    console.log("Error => ", err.message);
    res.status(500).json({ msg: "Something went wrong." });
  }
};
export default {
  contactUs,
  userMobileOTPSend,
  userMobileOTPVerification,
  listsLanguage,
};
