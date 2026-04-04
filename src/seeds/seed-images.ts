import { runCollectionSeed } from "./seedByCollection";

void runCollectionSeed("images")
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error("ERROR Error ejecutando seed images:", error);
    process.exit(1);
  });
