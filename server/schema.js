const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLList,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLNonNull,
} = require("graphql");

const axios = require("axios");
const { response } = require("express");

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
        console.log(parentValue);
        return axios(`http://localhost:4000/users/${parentValue.userId}`).then(
          (response) => response.data
        );
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
          .get(`http://localhost:4000/posts/${args.id}`)
          .then((response) => response.data);
      },
    },
    posts: {
      type: new GraphQLList(PostType),
      resolve(parentValue, args) {
        return axios.get(`http://localhost:4000/posts`).then((response) => {
          return response.data;
        });
      },
    },
    users: {
      type: new GraphQLList(UserType),
      resolve() {
        return axios(`http://localhost:4000/users`).then(
          (response) => response.data
        );
      },
    },
  },
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addPost: {
      type: PostType,
      args: {
        userId: { type: GraphQLID },
        id: { type: GraphQLInt },
        title: { type: new GraphQLNonNull(GraphQLString) },
        body: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parentValue, args) {
        return axios
          .post(`http://localhost:4000/posts`, {
            userId: args.userId,
            id: args.id,
            title: args.title,
            body: args.body,
          })
          .then((response) => response.data);
      },
    },
    deletePost: {
      type: PostType,
      args: {
        id: { type: GraphQLID },
      },
      resolve(parentValue, args) {
        return axios
          .delete(`http://localhost:4000/posts/${args.id}`)
          .then((response) => response.data);
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
