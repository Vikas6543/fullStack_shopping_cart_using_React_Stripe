const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ordersSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    email: {
      type: 'string',
    },
    product: {
      type: String,
    },
    quantity: {
      type: Number,
    },
    price: {
      type: Number,
    },
    address: {
      type: Map,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Order', ordersSchema);
