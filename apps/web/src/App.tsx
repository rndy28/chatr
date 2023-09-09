/* eslint-disable @typescript-eslint/promise-function-async */
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Loader from "~/components/UI/atoms/Loader";
import GlobalStyles from "~/GlobalStyles";
import { SocketProvider } from "~/contexts/SocketContext";
import { UserProvider } from "~/contexts/UserContext";
import { Protected, Public } from "~/routes";

const Home = lazy(() => import("~/pages/home"));
const SignIn = lazy(() => import("~/pages/auth/signin"));
const SignUp = lazy(() => import("~/pages/auth/signup"));

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
      <SocketProvider>
        <UserProvider>
          <Suspense fallback={<Loader />}>
            <Routes>
              <Route path="/" element={<Protected />}>
                <Route path="/" element={<Home />} />
              </Route>
              <Route path="/signin" element={<Public />}>
                <Route path="/signin" element={<SignIn />} />
              </Route>
              <Route path="/signup" element={<Public />}>
                <Route path="/signup" element={<SignUp />} />
              </Route>
            </Routes>
          </Suspense>
        </UserProvider>
      </SocketProvider>
    </QueryClientProvider>
  </BrowserRouter>
);

export default App;
