import { runCollectionSeed } from "./seedByCollection";

void runCollectionSeed("inventory-items")
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error("ERROR Error ejecutando seed inventory-items:", error);
    process.exit(1);
  });
