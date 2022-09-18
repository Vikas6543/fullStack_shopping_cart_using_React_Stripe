const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Middleware
app.use(cors());
app.use(express.json());

// dot env config
dotenv.config();

// routes
app.use('/api', require('./routes/paymentRoute'));

// configuarations for deployment to vercel
if (process.env.NODE_ENV === 'production') {
  app.get('/', (req, res) => {
    app.use(express.static(path.resolve(__dirname, 'client', 'build')));
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
