const twilio = require("twilio")(
  process.env.TWILIO_SID,
  process.env.TWILIO_TOKEN
);

const sendSMS = async (options) => {
  await twilio.messages.create({
    body: options.body,
    to: options.userPhoneNumber,
    from: "+16476922681",
  });
};

module.exports = sendSMS;
