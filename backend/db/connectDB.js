import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log("DB CONNECTED WITH ", conn.connection.host);
  } catch (error) {
    console.log("DB NOT CONNECTED: ", error.message);
    process.exit(1)
  }
};
