import { runCollectionSeed } from "./seedByCollection";

void runCollectionSeed("table-bills")
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error("ERROR Error ejecutando seed table-bills:", error);
    process.exit(1);
  });
