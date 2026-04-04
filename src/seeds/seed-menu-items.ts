import { runCollectionSeed } from "./seedByCollection";

void runCollectionSeed("menu-items")
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error("ERROR Error ejecutando seed menu-items:", error);
    process.exit(1);
  });
