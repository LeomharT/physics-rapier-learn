import Experience from "./Experience";
import "./index.css";

const el = document.querySelector("#app");

const experience = new Experience();
el?.append(experience.canvas);
