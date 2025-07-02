import mongoose from "mongoose";
export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URl);
        console.log(`MogoDb Connected ${conn.connection.host}`)
    }
    catch (e) {
        console.error("Mongodb Connection Error:", e)
    }
}