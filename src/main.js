import { Bar } from "./js/bar.es6";
require("normalize.css/normalize.css");
import "./scss/main.scss";
const { Foo } = require("./js/foo.cjs");

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOMContentLoaded", "page-index");
});

window.Foo = Foo.instance();
window.Bar = Bar();

console.log(window.Foo.getValue());
console.log(window.Bar);
