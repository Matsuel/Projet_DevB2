import mongoose from "mongoose";

function connectToMongo() {
  mongoose.connect("mongodb://localhost:27017/autoecoles", {
  })
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.error("Error connecting to MongoDB", err);
    });
}

export default connectToMongo;