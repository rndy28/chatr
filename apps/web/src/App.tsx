/* eslint-disable @typescript-eslint/promise-function-async */
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { RootProvider } from "~/contexts/RootContext";
import GlobalStyles from "~/GlobalStyles";
import Signin from "~/pages/auth/signin";
import Signup from "~/pages/auth/signup";
import Home from "~/pages/home";
import { Protected, Public } from "~/routes";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  },
});

const App = () => (
  <BrowserRouter>
    <GlobalStyles />
    <QueryClientProvider client={queryClient}>
      <RootProvider>
        <Routes>
          <Route path="/" element={<Protected />}>
            <Route path="/" element={<Home />} />
          </Route>
          <Route path="/signin" element={<Public />}>
            <Route path="/signin" element={<Signin />} />
          </Route>
          <Route path="/signup" element={<Public />}>
            <Route path="/signup" element={<Signup />} />
          </Route>
        </Routes>
      </RootProvider>
    </QueryClientProvider>
  </BrowserRouter>
);

export default App;
