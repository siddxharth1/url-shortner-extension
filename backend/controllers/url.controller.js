const { default: mongoose } = require("mongoose");
const URL = require("../models/url.model");
const requestIp = require("request-ip");
require("dotenv").config();

const handleGetURL = async (req, res) => {
  const data = await URL.find({ createdBy: req.user._id }).sort({
    createdAt: -1,
  });
  return res.status(200).json(data);
};

const handleCreateURL = async (req, res) => {
  const numberOfUrlsCreated = await URL.find({
    createdBy: req.user._id,
  }).countDocuments();

  if (numberOfUrlsCreated >= 5) {
    return res.status(400).json({
      resp: "You have reached the maximum number of urls that can be created for free",
      numberOfUrlsCreated,
      popup: true,
      popupText: "buy premium to create more urls",
    });
  }

  const { nanoid } = await import("nanoid");
  const shortID = nanoid(8);
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ resp: "no url given" });
  }

  const resp = await URL.create({
    originalURL: url,
    shortURL: shortID,
    visitHistory: [],
    createdBy: req.user._id,
  });
  return res.status(200).json({ resp: resp });
};

const handleDeleteURL = async (req, res) => {
  const { id } = req.body;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ resp: "no such url found" });
  }

  const urlDelete = await URL.findOneAndDelete({ _id: id });

  if (!urlDelete) {
    return res.status(400).json({ resp: "no such url found" });
  }
  return res.json({ resp: urlDelete });
};

const handleGetRedirectURL = async (req, res) => {
  const { id } = req.params;
  let clientIp = req.clientIp;
  console.log(clientIp);
  let ipData = null;

  try {
    const response = await fetch(
      `https://api.ipgeolocation.io/ipgeo?apiKey=${process.env.IPGEOLOCATION_API_KEY}&ip=${clientIp}`
    );
    ipData = await response.json();
    console.log(ipData);
  } catch (error) {
    console.log(error);
  }

  // const url = await URL.findOne({ shortURL: id });
  const url = await URL.findOneAndUpdate(
    { shortURL: id },
    {
      $push: {
        visitHistory: {
          ipAddress: ipData.ip,
          timestamps: ipData.time_zone.current_time.substring(0, 10),
          location: {
            continent_name: ipData.continent_name,
            state_prov: ipData.state_prov,
            country_name: ipData.country_name,
            city: ipData.city,
          },
        },
      },
    },
    { new: true }
  );
  console.log(url);
  if (!url) {
    return res.status(404).json({ resp: "No such url found" });
  }
  return res.status(200).json({ resp: url.originalURL });
};

const handleGetAnalytics = async (req, res) => {
  const { id } = req.params;

  const resp = await URL.findOne({ shortURL: id }).select("-createdBy");
  if (!resp) {
    return res.status(404).json({ resp: "No such url found" });
  }
  return res.status(200).json({ resp: resp });
};

module.exports = {
  handleGetURL,
  handleCreateURL,
  handleDeleteURL,
  handleGetRedirectURL,
  handleGetAnalytics,
};
