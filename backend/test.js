const mongoose = require("mongoose");

const uri =
  "mongodb+srv://samarahmed200409:samar09@cluster0.ttaekx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

async function connectDB() {
  try {
    await mongoose.connect(uri);

    console.log("✅ MongoDB Connected Successfully");

    process.exit(0);
  } catch (error) {
    console.error("❌ Connection Failed");
    console.error(error);

    process.exit(1);
  }
}

connectDB();