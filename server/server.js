const express = require("express");
const dotenv = require("dotenv");
const { graphqlHTTP } = require("express-graphql");
const cors = require("cors");
const schema = require("./schema");
const app = express();
dotenv.config();
app.use(cors());
app.use(
  "/graphql",
  graphqlHTTP({
    graphiql: true,
    schema,
  })
);
app.listen(process.env.EXPRESS_PORT || 4000, () => {
  console.log("server started on port ", process.env.EXPRESS_PORT);
});
