import { runCollectionSeed } from "./seedByCollection";

void runCollectionSeed("contacts")
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error("ERROR Error ejecutando seed contacts:", error);
    process.exit(1);
  });
