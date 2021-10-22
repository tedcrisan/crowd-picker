import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Provider } from "next-auth/client";

import "styles/global.scss";
import { DataProvider } from "state/data-context";

export default function App({ Component, pageProps }) {
  return (
    <Provider session={pageProps.session}>
      <DataProvider>
        <Component {...pageProps} />
        <ToastContainer position="top-center" />
      </DataProvider>
    </Provider>
  );
}
