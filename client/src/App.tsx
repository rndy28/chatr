import Loader from "components/UI/atoms/Loader";
import GlobalStyles from "GlobalStyles";
import { SocketProvider } from "libs/contexts/SocketContext";
import { UserProvider } from "libs/contexts/UserContext";
import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Protected, Public } from "routes";

const Home = lazy(() => import("pages/home"));
const SignIn = lazy(() => import("pages/auth/signin"));
const SignUp = lazy(() => import("pages/auth/signup"));

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
