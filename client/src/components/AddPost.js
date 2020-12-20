import React, { Component } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { gql } from "apollo-boost";
import { graphql } from "react-apollo";
import { flowRight as compose } from "lodash";
import { getPostsQuery } from "./Posts";

const initialValues = {
  title: "",
  body: "",
  user: "",
};

const getUserIdQuery = gql`
  {
    users {
      id
      name
    }
  }
`;

const addPostMutation = gql`
  mutation($userId: ID!, $body: String!, $title: String!) {
    addPost(userId: $userId, body: $body, title: $title) {
      id
    }
  }
`;

const validationSchema = Yup.object({
  title: Yup.string().required("Title is required"),
  body: Yup.string().required("Content is required"),
});
class AddPost extends Component {
  mySubmit = (values, { resetForm }) => {
    console.log(values);
    this.props.addPost({
      variables: {
        userId: values.user,
        title: values.title,
        body: values.body,
      },
      refetchQueries: [{ query: getPostsQuery }],
    });
    resetForm();
  };
  render() {
    console.log(this.props);
    return (
      <div className="container">
        <Formik
          initialValues={initialValues}
          onSubmit={this.mySubmit}
          validationSchema={validationSchema}
        >
          <Form>
            <fieldset>
              <legend>Add Post</legend>
              <div className="form-group">
                <label htmlFor="title">Title</label>
                <Field className="form-control" id="title" name="title" />
                <ErrorMessage name="title" />
              </div>
              <div className="form-group">
                <label htmlFor="pwd">Body:</label>
                <Field className="form-control" id="body" name="body" />
                <ErrorMessage name="body" />
              </div>
              <div className="form-group">
                <label htmlFor="user">User:</label>
                <Field
                  as="select"
                  className="form-control"
                  id="user"
                  name="user"
                >
                  <option value="" label="Select a User" />
                  {this.props.userData.users &&
                    this.props.userData.users.map((x) => {
                      return <option key={x.id} value={x.id} label={x.name} />;
                    })}
                </Field>
                <ErrorMessage name="user" />
              </div>

              <button type="submit" className="btn btn-primary">
                Submit
              </button>
            </fieldset>
          </Form>
        </Formik>
      </div>
    );
  }
}

export default compose(
  graphql(getUserIdQuery, { name: "userData" }),
  graphql(addPostMutation, { name: "addPost" })
)(AddPost);
