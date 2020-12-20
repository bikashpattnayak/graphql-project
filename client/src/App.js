import "./App.css";
import Posts from "./components/Posts";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";

const client = new ApolloClient({
  uri: "http://localhost:4111/graphql",
});

function App() {
  return (
    <ApolloProvider client={client}>
      <div className="App">
        <Posts />
      </div>
    </ApolloProvider>
  );
}

export default App;
