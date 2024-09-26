import { ApolloClient, HttpLink, InMemoryCache, from } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { setContext } from "@apollo/client/link/context";
import createUploadLink from "apollo-upload-client/createUploadLink.mjs";

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('admin_lunsjavtale')
    ? `JWT ${localStorage.getItem('admin_lunsjavtale')}`
    : "";

  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      Authorization: token,
    },
  };
});

const errorLink = onError(
  ({ graphQLErrors, networkError, operation, forward }) => {
    // Graphql Error hapenning
    if (graphQLErrors) {
      graphQLErrors.forEach(({ message, extensions, locations, path }) => {
        console.log('graphql err:',message)
        if (
          message === "Signature has expired" ||
          message === "You are not authorized user."
        ) {
          localStorage.removeItem('admin_lunsjavtale');
          // localStorage.removeItem("refresh");
          window.location.href = "/login";
        }
      });
    }

    // If network error happening
    if (networkError) {
      console.log(`[Network error]: ${networkError}`);
    }
  }
);

const BASE_URL = import.meta.env.VITE_API_URL;

const link = from([
  errorLink,
  new createUploadLink({uri: BASE_URL})
]);
//url
export const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(link),
});
