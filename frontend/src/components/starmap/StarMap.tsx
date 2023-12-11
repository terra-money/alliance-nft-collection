import { useState } from "react";
import { allPlanets, PlanetProps } from "fakeData/planets";
import styles from "./StarMap.module.scss";

const StarMap = ({
  planet,
  setPlanet
}: {
  planet: string,
  setPlanet?: (planet: PlanetProps) => void
}) => {
  const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null);

  const handlePlanetClick = (planetNumber: number) => {
    if (setPlanet) {
      setPlanet(allPlanets[planetNumber - 1]);
    } else {
      window.location.href = `/planet/${planetNumber}`;
    }
  };

  const handleMouseEnter = (planetName: string) => {
    setHoveredPlanet(planetName);
  };

  const handleMouseLeave = () => {
    setHoveredPlanet(null);
  };

  const lines = (
    <>
      <line x1="72.9293" y1="28.495" x2="30.9293" y2="22.495" stroke="#4D4A48" strokeDasharray="4 4"/>
      <line x1="167.81" y1="123.463" x2="106.81" y2="98.4627" stroke="#4D4A48" strokeDasharray="4 4"/>
      <line x1="93.5024" y1="83.0485" x2="89.5024" y2="42.0485" stroke="#4D4A48" strokeDasharray="4 4"/>
      <line x1="154.091" y1="17.4916" x2="100.091" y2="27.4916" stroke="#4D4A48" strokeDasharray="4 4"/>
      <line x1="176.503" y1="117.05" x2="167.503" y2="28.0503" stroke="#4D4A48" strokeDasharray="4 4"/>
      <line x1="188.933" y1="126.505" x2="269.933" y2="115.505" stroke="#4D4A48" strokeDasharray="4 4"/>
      <line x1="285.995" y1="18.5" x2="176.995" y2="17.5" stroke="#4D4A48" strokeDasharray="4 4"/>
      <line x1="272.694" y1="100.395" x2="174.694" y2="24.3951" stroke="#4D4A48" strokeDasharray="4 4"/>
      <line x1="292.504" y1="91.9401" x2="299.504" y2="33.9401" stroke="#4D4A48" strokeDasharray="4 4"/>
      <line x1="400.013" y1="15.4998" x2="321.013" y2="17.4998" stroke="#4D4A48" strokeDasharray="4 4"/>
      <line x1="401.324" y1="20.3811" x2="308.324" y2="99.3811" stroke="#4D4A48" strokeDasharray="4 4"/>
      <line x1="378" y1="112.5" x2="312" y2="112.5" stroke="#4D4A48" strokeDasharray="4 4"/>
      <line x1="392.508" y1="100.912" x2="406.508" y2="22.9117" stroke="#4D4A48" strokeDasharray="4 4"/>
      <line x1="10.5016" y1="117.96" x2="17.5016" y2="30.9599" stroke="#4D4A48" strokeDasharray="4 4"/>
      <line x1="16.8505" y1="121.523" x2="83.8505" y2="100.523" stroke="#4D4A48" strokeDasharray="4 4"/>
    </>
  );

  const renderPlanet = ({
    planetNumber, terrain, cx, cy, r, innerR
  }: PlanetProps) => {
    const lowerCaseTerrain = terrain.toLowerCase();

    const isActive = planet === lowerCaseTerrain;
    const strokeColor = isActive ? "#00C2FF" : "#4D4A48";

    return (
      <>
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill={"#2F2E2D"}
          stroke={strokeColor}
          onClick={() => handlePlanetClick(planetNumber)}
          onMouseEnter={() => handleMouseEnter(lowerCaseTerrain)}
          onMouseLeave={handleMouseLeave}
        />
        {isActive && <circle cx={cx} cy={cy} r={innerR} fill="#00C2FF" />}
      </>
    );
  };

  return (
    <svg
      className={styles.starmap__svg}
      width="418"
      height="139"
      viewBox="0 0 418 139"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {allPlanets.map(renderPlanet)}
      {lines}
      {allPlanets.map(({ name, terrain, cx, cy, r }: PlanetProps) => {
        const lowerCaseTerrain = terrain.toLowerCase();
        const isActive = planet === lowerCaseTerrain;
        const isHovered = hoveredPlanet === lowerCaseTerrain;
        let xIndex = cx + r + 8;
        let yIndex = cy + 6;
        if (lowerCaseTerrain === "fire") {
          xIndex = cx + r + 4;
          yIndex = cy - 5;
        } else if (lowerCaseTerrain === "meadows") {
          xIndex = cx + r - 40;
          yIndex = cy + 35;
        } else if (lowerCaseTerrain === "asteroid") {
          xIndex = cx + r - 30;
          yIndex = cy - 25;
        } else if (lowerCaseTerrain === "flowerbeds") {
          xIndex = cx - r - 100;
          yIndex = cy + 25;
        } else if (lowerCaseTerrain === "crystal") {
          xIndex = cx - r - 90;
          yIndex = cy + 20;
        }

        return (isActive || isHovered) && (
          <text
            key={`${name} (${terrain})`}
            x={xIndex}
            y={yIndex}
            className={styles.text}
          >
            {`${name} (${terrain})`}
          </text>
        );
      })}
    </svg>
  );
};

export default StarMap;
