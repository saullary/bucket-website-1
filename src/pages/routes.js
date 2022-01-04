import Home from "./home";
import Storage from "./storage";
import Domains from "./domains";
import Billing from "./billing";
import Settings from "./settings";

export default [
  {
    path: "/",
    component: Home,
    meta: {
      noLogin: true,
    },
  },
  {
    path: "/storage/*",
    component: Storage,
  },
  {
    path: "/domains",
    component: Domains,
    meta: {
      title: "Domains",
    },
  },
  {
    path: "/billing",
    component: Billing,
    meta: {
      title: "Billing",
    },
  },
  {
    path: "/settings",
    component: Settings,
    meta: {
      title: "Settings",
    },
  },
];
