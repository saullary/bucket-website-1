import Home from "./home";
import Storage from "./storage";
import Domains from "./domains";
import Domain from "./domain";
import Billing from "./billing";
import Settings from "./settings";
import Apikey from "./user/apikey";

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
    path: "/domain",
    component: Domains,
    meta: {
      title: "Domains",
    },
  },
  {
    path: "/domain/:name",
    component: Domain,
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
  {
    path: "/apikey",
    component: Apikey,
    meta: {
      title: "API Key",
    },
  },
];
