import { runCollectionSeed } from "./seedByCollection";

void runCollectionSeed("orders")
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error("ERROR Error ejecutando seed orders:", error);
    process.exit(1);
  });
