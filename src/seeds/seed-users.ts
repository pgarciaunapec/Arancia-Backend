import { runCollectionSeed } from "./seedByCollection";

void runCollectionSeed("users")
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error("ERROR Error ejecutando seed users:", error);
    process.exit(1);
  });
