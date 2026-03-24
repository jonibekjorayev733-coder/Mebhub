const mongoose = require("mongoose");

async function connectMongo() {
  const uri =
    process.env.MONGODB_URI ||
    process.env.MONGODB_URL ||
    process.env.MONGO_URI ||
    process.env.DATABASE_URL;
  if (!uri) {
    throw new Error("Missing env var: MONGODB_URI (or MONGODB_URL/MONGO_URI/DATABASE_URL)");
  }

  mongoose.set("strictQuery", false);

  await mongoose.connect(uri);
  console.log("[edu-arena] MongoDB connected");
}

module.exports = { connectMongo };

