const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const customerSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    mobile: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
    },
    pwd: {
      type: String,

      trim: true,
    },

    addresses: [],
    tokens: [
      {
        _id: false,
        token: {
          type: String,
          required: true,
        },
      },
    ],

    is_active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

customerSchema.pre("save", async function (next) {
  // Hash the password before saving the user model
  const customer = this;
  if (customer.isModified("pwd")) {
    customer.pwd = await bcrypt.hash(customer.pwd, 9);
  }
  next();
});

customerSchema.methods.generateAuthToken = async function () {
  // Generate an auth token for the user
  const customer = this;
  const token = jwt.sign({ _id: customer._id }, process.env.JWT_KEY);
  customer.tokens = customer.tokens.concat({ token });
  await customer.save();
  return token;
};

customerSchema.statics.loginmobile = async (mobile) => {
  const customer = await Customer.findOne({
    mobile: mobile,
  });
  if (!customer) {
    throw new Error("Invalid credentials.");
  }
  if (!customer.is_active) {
    throw new Error("Your account has been deactivated.");
  }

  return customer;
};

customerSchema.statics.loginemail = async (email, pwd) => {
  const customer = await Customer.findOne({
    email: email,
  });
  if (!customer) {
    throw new Error("Invalid credentials.");
  }
  if (!customer.is_active) {
    throw new Error("Your account has been deactivated.");
  }
  const isPasswordMatch = await bcrypt.compare(pwd, customer.pwd);
  if (!isPasswordMatch) {
    throw new Error("Invalid credentials.");
  }
  return customer;
};

customerSchema.statics.changepassword = async (email, oldpwd, newpwd) => {
  var customer = await Customer.findOne({ email });
  if (!customer) {
    throw new Error("Invalid user.");
  }
  const isPasswordMatch = await bcrypt.compare(oldpwd, customer.pwd);
  if (!isPasswordMatch) {
    throw new Error("Invalid old password.");
  } else {
    customer = await Customer.findOneAndUpdate(
      { username },
      { pwd: await bcrypt.hash(newpwd, 9) },
      { new: true }
    );
  }

  return customer;
};

customerSchema.statics.resetpassword = async (id, newpwd) => {
  const customer = await Customer.findOneAndUpdate(
    { _id: id },
    { pwd: await bcrypt.hash(newpwd, 9) },
    { new: true }
  );
  if (!customer) {
    throw new Error("Invalid user.");
  }
  return customer;
};

const Customer = mongoose.model("customers", customerSchema);

module.exports = Customer;
