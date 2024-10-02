import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import GridBackground from "./components/ui/GridBackground.jsx";

import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

const client = new ApolloClient({
  // TODO --> update below uri on production
  uri:
    import.meta.env.VITE_NODE_ENV === "development"
      ? "http://localhost:4000/graphql"
      : "/graphql", // this is server url of graphql
  cache: new InMemoryCache(),
  credentials: "include", // this tells apollo client to send cookies along with every requests to the server.
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ApolloProvider client={client}>
        <GridBackground>
          <App />
        </GridBackground>
      </ApolloProvider>
    </BrowserRouter>
  </StrictMode>
);
