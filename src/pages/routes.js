import Home from "./home";
import Storage from "./storage";
import Domain from "./domain";
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
    path: "/domain",
    component: Domain,
    meta: {
      title: "Domain",
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
