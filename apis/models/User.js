const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter a name"],
    },
    email: {
      type: String,
      required: [true, "Please enter an email"],
      unique: [
        true,
        "An account with that email address already exists. Please log in to continue.",
      ],
      lowercase: true,
      trim: true,
      match: [/.+@.+\..+/, "Please enter a valid email"],
    },
    google_id: {
      type: String,
      sparse: true,
      default: null,
    },
    otp: {
      type: String,
      default: null,
    },
    otp_expiry: {
      type: String,
      default: null,
    },
    password: {
      type: String,
      default: null,
    },
    image: {
      type: String,
      default: null,
    },
    phone_number: {
      type: String,
      default: null,
    },
    isverified: {
      type: Boolean,
      default: false,
    },
    token: {
      type: String,
      default: null,
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hashSync(user.password, 12);
  }
  next();
});

userSchema.methods.generateAuthToken = function (data) {
  const user = this;
  const id = { _id: user._id };
  data = { ...data, ...id };
  const token = jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1000m",
  });
  // const token = jwt.sign(data, process.env.ACCESS_TOKEN_SECRET);
  return token;
};

userSchema.methods.generateRefreshToken = function (data) {
  const user = this;
  const id = { _id: user._id };
  data = { ...data, ...id };
  const token = jwt.sign(data, process.env.REFRESH_TOKEN_SECRET);
  return token;
};

userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    console.log(error);
    throw new Error("Error comparing passwords");
  }
};

module.exports = mongoose.model("User", userSchema);
