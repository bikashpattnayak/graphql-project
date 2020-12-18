const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLList,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
} = require("graphql");

const axios = require("axios");

const AddressType = new GraphQLObjectType({
  name: "Address",
  fields: () => ({
    street: { type: GraphQLString },
    suite: { type: GraphQLString },
    city: { type: GraphQLString },
    zipcode: { type: GraphQLString },
  }),
});

const PostType = new GraphQLObjectType({
  name: "Post",
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    body: { type: GraphQLString },
    user: {
      type: UserType,
      resolve(parentValue, args) {
        return axios(
          `https://jsonplaceholder.typicode.com/users/${parentValue.userId}`
        ).then((response) => response.data);
      },
    },
  }),
});

const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    phone: { type: GraphQLString },
    website: { type: GraphQLString },
    address: {
      type: AddressType,
    },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    post: {
      type: PostType,
      args: { id: { type: GraphQLID } },
      resolve(parentValue, args) {
        return axios
          .get(`https://jsonplaceholder.typicode.com/posts/${args.id}`)
          .then((response) => response.data);
      },
    },
    posts: {
      type: new GraphQLList(PostType),
      resolve(parentValue, args) {
        return axios
          .get(`https://jsonplaceholder.typicode.com/posts`)
          .then((response) => {
            return response.data;
          });
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
});
