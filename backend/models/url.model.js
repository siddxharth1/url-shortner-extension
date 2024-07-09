const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema(
  {
    originalURL: {
      type: String,
      required: true,
    },
    shortURL: {
      type: String,
      required: true,
    },
    visitHistory: [
      {
        ipAddress: {
          type: String,
          default: "NA",
        },
        timestamps: {
          type: String,
          default: Date.now,
        },
        location: {
          continent_name: {
            type: String,
            default: "NA",
          },
          state_prov: {
            type: String,
            default: "NA",
          },
          country_name: {
            type: String,
            default: "NA",
          },
          city: {
            type: String,
            default: "NA",
          },
        },
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const URL = mongoose.model("URL", urlSchema);
module.exports = URL;
