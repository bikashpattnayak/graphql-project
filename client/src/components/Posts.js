import React, { Component } from "react";
import AddPost from "./AddPost";
import { gql } from "apollo-boost";
import { graphql } from "react-apollo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { flowRight as compose } from "lodash";

export const getPostsQuery = gql`
  query {
    posts {
      id
      title
      body
      user {
        name
      }
    }
  }
`;

export const deletePost = gql`
  mutation($id: ID!) {
    deletePost(id: $id) {
      id
    }
  }
`;

class Posts extends Component {
  deletePost = (val) => {
    this.props.deletePost({
      variables: {
        id: val,
      },
      refetchQueries: [{ query: getPostsQuery }],
    });
  };
  render() {
    console.log("bikash", this.props);
    return (
      <div className="container">
        <h2>POST</h2>
        <div className="mytable">
          <table className="table table-striped table-bordered table-hover">
            <thead>
              <tr>
                <th>Id</th>
                <th>Title</th>
                <th>Body</th>
                <th>UserId</th>
                <th>&nbsp;</th>
              </tr>
            </thead>
            <tbody>
              {this.props.getPostsQuery.posts &&
                this.props.getPostsQuery.posts.map((r) => {
                  return (
                    <tr key={r.id}>
                      <td>{r.id}</td>
                      <td>{r.title}</td>
                      <td>{r.body}</td>
                      <td>{r.user.name}</td>
                      <td>
                        <FontAwesomeIcon
                          onClick={this.deletePost.bind(this, r.id)}
                          icon={faTrash}
                        />
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
        <AddPost />
      </div>
    );
  }
}

export default compose(
  graphql(getPostsQuery, { name: "getPostsQuery" }),
  graphql(deletePost, { name: "deletePost" })
)(Posts);
