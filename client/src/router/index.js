import Router from "vue-router";
import HomeComponent from "../components/HomeComponent";
import EditorPageComponent from "../components/EditorPageComponent";
import PageNotFoundComponent from "../components/PageNotFoundComponent";

const router = new Router({
  mode: "history",
  routes: [
    { name: "Home", path: "/", component: HomeComponent, props: true },
    {
      name: "Editor",
      path: "/editor/:roomId",
      component: EditorPageComponent,
      props: true,
    },
    {
      path: "*",
      component: PageNotFoundComponent,
      props: true,
    },
  ],
});

export default router;
