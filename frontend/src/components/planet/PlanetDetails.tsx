import classNames from 'classnames/bind';
import { PlanetProps } from 'fakeData/planets';
import styles from './PlanetDetails.module.scss';

const cx = classNames.bind(styles);

interface PlanetDetailsProps extends PlanetProps {
  isStoryPage?: boolean;
}

export const PlanetDetails = ({
  terrain,
  coordinates,
  circumference,
  inhabitants,
  image,
  isStoryPage
}: PlanetDetailsProps) => {
  return (
    <div className={cx(styles.planet__details__container, { [styles.is__story__page]: isStoryPage })}>
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
