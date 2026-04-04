import { runCollectionSeed } from "./seedByCollection";

void runCollectionSeed("payments")
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error("ERROR Error ejecutando seed payments:", error);
    process.exit(1);
  });
