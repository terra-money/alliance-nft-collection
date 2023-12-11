import { useState } from 'react';
import classNames from 'classnames/bind';
import { default as Content } from "content/TheStory.mdx";
import StarMap from 'components/starmap';
import { PlanetDetails } from 'components/planet/PlanetDetails';
import { allPlanets } from 'fakeData/planets';

import styles from "./TheStory.module.scss";
import tabStyles from "./Tabs.module.scss";

const cx = classNames.bind(styles);

export const TheStory = () => {
  const randomPlanet = allPlanets[Math.floor(Math.random() * allPlanets.length)];

  const [planetInfoView, setPlanetInfoView] = useState(true);
  const [planet, setPlanet] = useState(randomPlanet);

  return (
    <div className={styles.page__container}>
      <div className={styles.left__side}>
        <div className={styles.flex__wrapper}>
          <div className={styles.star__map}>
            <StarMap planet={planet.terrain.toLowerCase()} setPlanet={setPlanet} />
          </div>

          <div className={styles.planet__details__container}>
            <div className={styles.title__container}>
              <h5>Planet #{planet.planetNumber}</h5>
              <h1>{planet.name}</h1>
            </div>

            <PlanetDetails {...planet} isStoryPage />
          </div>
        </div>
      </div>

      <div className={styles.content__container}>
        <div className={tabStyles.buttons}>
          <button
            className={cx(tabStyles.button, { [tabStyles.button__selected]: planetInfoView })}
            onClick={() => setPlanetInfoView(true)}
          >
            Planet Info
          </button>
          <button
            className={cx(tabStyles.button, { [tabStyles.button__selected]: !planetInfoView })}
            onClick={() => setPlanetInfoView(false)}
          >
            Full Story
          </button>
        </div>
        {planetInfoView ? (
          <div className={styles.planet__content}>
            <div className={styles.paragraph__section}>
              <h3>Planet</h3>
              <p>{planet.planetDescription}</p>
            </div>
            <div className={styles.paragraph__section}>
              <h3>Inhabitants</h3>
              <p>{planet.inhabitantsDescription}</p>
            </div>
          </div>
        ) : (
          <Content />
        )}
      </div>
    </div>
  );
};
