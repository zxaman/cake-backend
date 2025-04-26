import mongoose, { Schema } from "mongoose";
import crypto from "crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
import { USER_TEMPORARY_TOKEN_EXPIRY } from "../constants.js";
import {
  SchemaNameEnum,
  UserRolesEnum,
  UserStatusEnum,
  GenderEnum,
} from "../constants.js";

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
    },
    mobileNo: {
      type: String,
      required: true,
    },
    dob: {
      type: Date,
      required: true,
    },
    gender: {
      type: String,
      enum: Object.values(GenderEnum),
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    employeeId: {
      type: String,
      required: true,
      unique: true,
    },
    userStatus: {
      type: String,
      enum: Object.values(UserStatusEnum),
      default: UserStatusEnum.ACTIVE,
    },
    avatar: {
      type: String,
    },
    userRole: {
      type: String,
      enum: Object.values(UserRolesEnum),
      default: UserRolesEnum.USER,
    },
    forgotPasswordToken: {
      type: String,
    },
    forgotPasswordExpiry: {
      type: Date,
    },
  },
  {
    timestamps: true,
    methods: {
      async comparePassword(password) {
        return bcrypt.compare(password, this.password);
      },
      generateAccessToken() {
        return jwt.sign(
          {
            _id: this._id,
            email: this.email,
            userRole: this.userRole,
          },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: process.env.ACCESS_TOKEN_EXPIRY },
        );
      },
      generateTemporaryToken() {
        // This token should be client facing
        // for example: for email verification unHashedToken should go into the user's mail
        const unHashedToken = crypto.randomBytes(20).toString("hex");

        // This should stay in the DB to compare at the time of verification
        const hashedToken = crypto
          .createHash("sha256")
          .update(unHashedToken)
          .digest("hex");
        // This is the expiry time for the token (20 minutes)
        const tokenExpiry = Date.now() + USER_TEMPORARY_TOKEN_EXPIRY;

        return { unHashedToken, hashedToken, tokenExpiry };
      },
    },
    virtuals: {
      fullName: {
        get() {
          return `${this.firstName} ${this.lastName}`;
        },
      },
    },
  },
);

// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();
//   this.password = bcrypt.hashSync(this.password, 10);
//   next();
// });

userSchema.pre("save", async function (next) {
  if (this.isModified("dob") && typeof this.dob === "string") {
    this.dob = new Date(this.dob);
  }

  if (this.isModified("password")) {
    this.password = bcrypt.hashSync(this.password, 10);
  }

  next();
});

userSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();

  if (update.password) {
    update.password = bcrypt.hashSync(update.password, 10);
  }

  next();
});

userSchema.plugin(mongooseAggregatePaginate);

export const User = mongoose.model(SchemaNameEnum.USER, userSchema);
