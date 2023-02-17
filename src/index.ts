import listEndpoints from "express-list-endpoints";
import mongoose from "mongoose";
const port = process.env.PORT || 3001;
import { httpServer, expressServer } from "./server";

mongoose.connect(process.env.MONGO_URL!);

mongoose.connection.on("connected", () => {
  console.log("Successfully connected to Mongo!");

  httpServer.listen(port, () => {
    console.table(listEndpoints(expressServer));
    console.log(`HthttpServer is running on port ${port}`);
  });
});
export { httpServer };
