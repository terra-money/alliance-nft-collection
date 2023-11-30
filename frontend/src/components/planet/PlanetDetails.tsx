import { PlanetProps } from 'fakeData/planets';
import styles from './PlanetDetails.module.scss';

export const PlanetDetails = ({
  terrain,
  coordinates,
  circumference,
  inhabitants,
  image
}: PlanetProps) => {
  return (
    <div className={styles.planet__details__container}>
      <div className={styles.planet__attributes}>
        <div className={styles.row}>
          <span>Terrain</span>
          <span>{terrain}</span>
        </div>
        <div className={styles.row}>
          <span>Coordinates</span>
          <span>{coordinates}</span>
        </div>
        <div className={styles.row}>
          <span>Circumference</span>
          <span>{circumference}</span>
        </div>
        <div className={styles.row}>
          <span>Inhabitants</span>
          <span>{inhabitants}</span>
        </div>
      </div>
      <div className={styles.image__wrapper}>
        <div
          className={styles.planet__image}
          style={{ backgroundImage: `url("${image}")` }}
        />
      </div>
    </div>
  );
};
