import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { makeServer } from "./mirage/server.ts";
import { Provider } from "react-redux";
import { store } from "./redux/store/index.ts";
makeServer();

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <App />
  </Provider>
);
