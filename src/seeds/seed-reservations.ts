import { runCollectionSeed } from "./seedByCollection";

void runCollectionSeed("reservations")
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error("ERROR Error ejecutando seed reservations:", error);
    process.exit(1);
  });
