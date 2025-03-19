var nodemailer = require("nodemailer");
var fs = require("fs");
var handlebars = require("handlebars");
require("dotenv").config();
const { queryErrorRelatedResponse, successResponse } = require("./sendResponse");

const sendMail = async (data, req, res) => {
  // const mail = await Generalsetting.findOne();
  var transporter = nodemailer.createTransport({
    service: process.env.SMTP_SERVICE,
    secure: true,
    // auth: {
    //   user: mail.email,
    //   pass: mail.password,
    // },
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  fs.readFile(data.htmlFile, { encoding: "utf-8" }, function (err, html) {
    if (err) {
      // console.log(err);
    } else {
      var template = handlebars.compile(html);
      var replacements = {
        resetLink: data.extraData.resetLink,
        OTP: data.extraData.otp,
        username: data.extraData.username,
        useremail: data.extraData.useremail,
        usermo: data.extraData.usermo,
        question: data.extraData.question,
        copyrighttext: "© 2025 Car Auto Wash. All rights reserved.",
      };
      var htmlToSend = template(replacements);

      var mailOptions = {
        from: data.from,
        to: data.to,
        cc: data.cc,
        subject: data.sub,
        html: htmlToSend,
      };

      transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
          // console.log(err, "err");
          return queryErrorRelatedResponse(res, 500, "Something went wrong");
          // return 0;
        } else {
          return successResponse(res, "Check your email");
          // return "done";
        }
      });
    }
  });
};
module.exports.sendMail = sendMail;
