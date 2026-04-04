import { runAllCollectionSeeds } from "./seedByCollection";

void runAllCollectionSeeds()
  .then(() => {
    console.log("SEED Seed completo finalizado");
    process.exit(0);
  })
  .catch((error) => {
    console.error("ERROR Error ejecutando seed completo:", error);
    process.exit(1);
  });
