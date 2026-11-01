module.exports = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || "development",
  mongodbUri: process.env.MONGODB_URI,
  morganFormat: process.env.NODE_ENV === "production" ? "combined" : "dev",
};