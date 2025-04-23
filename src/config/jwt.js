module.exports = {
    JWT_SECRET: process.env.JWT_SECRET || "your-secret-key",
    JWT_EXPIRES_IN: "90d", // Token expires in 90 days
  };