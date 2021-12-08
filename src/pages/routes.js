import Home from "./home";
import Domain from "./domain";
import Billing from "./billing";

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
];
