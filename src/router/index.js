import Router from "vue-router";
import HomeComponent from "../components/HomeComponent";
import EditorComponent from "../components/EditorComponent";

const router = new Router({
  mode: "history",
  routes: [
    { name: "Home", path: "/", component: HomeComponent },
    { name: "Editor", path: "/editor/:roomId", component: EditorComponent },
  ],
});

export default router;
