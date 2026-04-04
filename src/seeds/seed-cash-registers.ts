import { runCollectionSeed } from "./seedByCollection";

void runCollectionSeed("cash-registers")
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error("ERROR Error ejecutando seed cash-registers:", error);
    process.exit(1);
  });
