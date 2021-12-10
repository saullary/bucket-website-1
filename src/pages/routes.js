import Home from "./home";
import Domain from "./domain";
import Billing from "./billing";
import Settings from "./settings";

export default [
  {
    path: "/",
    component: Home,
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
