import mongoose from "mongoose";

const connectDB = async () => {
    try {
        console.log(`${process.env.MONGODB_URI}${process.env.DB_Name}`);

        const conn_instance = await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_Name}`)
        console.log(conn_instance.connection.host);
    } catch (error) {
        console.log(" MongoDB Connection Error : ", error);
        process.exit(1)
    }
}

export default connectDB