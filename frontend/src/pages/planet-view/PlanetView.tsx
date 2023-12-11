import { useParams } from "react-router-dom";
import { allPlanets } from "fakeData/planets";
import { PlanetDetails } from "components/planet/PlanetDetails";
import styles from "./PlanetView.module.scss";

export const PlanetView = () => {
  const { id } = useParams();
  const planet = allPlanets[Number(id) - 1];

  return (
    <div className={styles.planet__view__container}>
      <div className={styles.title__container}>
        <h5>Planet #{planet.planetNumber}</h5>
        <h1>{planet.name}</h1>
      </div>

      <PlanetDetails {...planet} />

      <div className={styles.paragraph__section}>
        <h3>Planet</h3>
        <p>{planet.planetDescription}</p>
      </div>
      <div className={styles.paragraph__section}>
        <h3>Inhabitants</h3>
        <p>{planet.inhabitantsDescription}</p>
      </div>
    </div>
  );
};
