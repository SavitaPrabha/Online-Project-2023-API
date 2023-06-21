const mongoose = require("mongoose");
const dburi =
  "mongodb+srv://savitaprabha:savi123456789@cluster0.grktiir.mongodb.net/OnlineEducation";

mongoose
  .connect(dburi)
  .then(() => console.log("mongodb connected"))
  .catch((err) => console.log(err));

// mongoose.connect(dburi, {
//   useNewUrlParser: true,
//   useFindAndModify: false,
//   useCreateIndex: true,
//   useUnifiedTopology: true,
//   dbName: "app",
// }).then(()=>console.log("mongodb connected"))
// .catch(err=>console.log(err))
