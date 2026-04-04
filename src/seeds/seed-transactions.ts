import { runCollectionSeed } from "./seedByCollection";

void runCollectionSeed("transactions")
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error("ERROR Error ejecutando seed transactions:", error);
    process.exit(1);
  });
