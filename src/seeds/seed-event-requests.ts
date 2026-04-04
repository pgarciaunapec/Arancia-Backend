import { runCollectionSeed } from "./seedByCollection";

void runCollectionSeed("event-requests")
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error("ERROR Error ejecutando seed event-requests:", error);
    process.exit(1);
  });
