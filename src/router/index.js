import Router from "vue-router";
import HomeComponent from "../components/HomeComponent";
import EditorPageComponent from "../components/EditorPageComponent";

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
  ],
});

export default router;
