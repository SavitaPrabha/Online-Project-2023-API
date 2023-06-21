let request = require("request");
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

class SMSServices {
  GetOTP = async (mobile, country = "India") => {
    const otp = Math.floor(100000 + Math.random() * 900000);

    const message = "Your online education application one-time passcode is: " + otp;

    return new Promise(async (resolve) => {
      if (country == "India") {
        let options = {
          url:
            "http://2factor.in/API/V1/ecead03f-40f4-11ea-9fa5-0200cd936042/SMS/" +
            mobile +
            "/" +
            otp,
          method: "POST",
        };

        request(options, async (error, response, body) => {
          if (error) console.log(error);
          else {
            resolve(otp);
          }
        });
      } else {
        console.log(message, mobile);
        client.messages
          .create({
            body: message,
            messagingServiceSid: "MG642c7e4ac47ee6cacef2c1e77f321096",
            to: mobile,
          })
          .then((message) => {
            console.log(message);
            resolve(otp);
          });
      }
    });
  };

  SendSMS = async (mobile, message) => {
    return new Promise((resolve) => {
      var options = {
        url:
          "http://173.45.76.226:81/send.aspx?username=theonlinearena&pass=TOABulk321&route=trans1&senderid=TOASMS&numbers=" +
          mobile +
          "&message=" +
          message,
        method: "GET",
      };

      request(options, async (error, response, body) => {
        if (error) console.log(error);
        else {
          resolve(body);
        }
      });
    });
  };
}

module.exports = new SMSServices();
