const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const mongoose = require('mongoose');

// Middleware
app.use(cors());
app.post(
  '/payment/webhook',
  express.json({
    verify: (req, res, buf) => {
      req.rawBody = buf.toString();
    },
  })
);

app.use(express.json());

// dot env config
dotenv.config();

// database connection
const connectDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Database Connected');
  } catch (error) {
    console.log(error);
  }
};

connectDatabase();

// routes
app.use('/user', require('./routes/userRoute'));
app.use('/payment', require('./routes/paymentRoute'));

// configuarations for deployment to vercel
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  app.get('*', (req, res) =>
    res.sendFile(path.join(__dirname, 'client/build/index.html'))
  );
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
