import { runCollectionSeed } from "./seedByCollection";

void runCollectionSeed("delivery-orders")
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error("ERROR Error ejecutando seed delivery-orders:", error);
    process.exit(1);
  });
