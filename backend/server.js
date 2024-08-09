const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const cors = require("cors");
const nodemailer = require("nodemailer");
const stripe = require("stripe")(
  "sk_test_51PJ0wqFt8twZCtdFAkCCtwJLxnwqpmL3sChkaDVNMtakr8kxlDJ4DhYJqri5ZwUChb3ZTjc0JyVc5b6SAScjrfni00a2egYVxw"
);

const app = express();
app.use(cors()); // Add this line
app.use(bodyParser.json());

app.post("/create-payment-intent", async (req, res) => {
  try {
    const { amount } = req.body;

    // Convert USD to PKR using an exchange rate API
    const exchangeRateResponse = await axios.get(
      "https://api.exchangerate-api.com/v4/latest/USD"
    );
    const exchangeRate = exchangeRateResponse.data.rates.PKR;
    const amountPKR = Math.round(amount * exchangeRate); // Amount in smallest currency unit (cents)

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountPKR,
      currency: "PKR",
      payment_method_types: ["card"], // Specify payment method types here
    });

    res.json({
      paymentIntent: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/send-email", (req, res) => {
  const { name, email, message } = req.body;

  // Create a nodemailer transporter
  let transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "aliza.ahmed83@gmail.com",
      pass: "nonu mlhj wftr miec",
    },
  });

  // Define email options
  let mailOptions = {
    from: email,
    to: "aliza.ahmed83@gmail.com",
    subject: "New Complaint from Contact Form",
    text: `Name: ${name}\nMessage: ${message}`,
  };

  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).send("Error sending email");
    } else {
      console.log("Email sent: " + info.response);
      res.send("Email sent successfully");
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
