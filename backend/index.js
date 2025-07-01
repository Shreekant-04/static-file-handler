require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");
const { initGridFS } = require("./config/gridFs");
connectDB();
initGridFS();

const port = process.env.PORT || 3002;
app.listen(port, () => {
  console.log(`listening on port : ${port}`);
});
