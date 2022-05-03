const Index = "/";
const Home = "/home";

export const AppRouting = {
  Index,
  Home,
  ProviderInjection: "/provider",
  Chat: "/chat",
};

console.log(process.env);

export const createAppUrl = (path: string) =>
  `http://${
    process.env.NODE_ENV === "development"
      ? process.env.REACT_APP_IP + ":3000"
      : window.location.host // "openrails.io"
  }/${path}`;

export default AppRouting;
