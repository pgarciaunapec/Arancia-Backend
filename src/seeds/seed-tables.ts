import { runCollectionSeed } from "./seedByCollection";

void runCollectionSeed("tables")
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error("ERROR Error ejecutando seed tables:", error);
    process.exit(1);
  });
