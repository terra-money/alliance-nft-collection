export interface PlanetProps {
  planetNumber: number;
  name: string;
  terrain: string;
  coordinates: string;
  circumference: string;
  inhabitants: string;
  image: string;
  planetDescription: string;
  inhabitantsDescription: string;
  cx: number;
  cy: number;
  r: number;
  innerR: number;
}

export const allPlanets = [
  {
    planetNumber: 1,
    name: 'Ozara',
    terrain: 'Desert',
    coordinates: '112xr3, 33r, 8439z',
    circumference: '40,075 AU',
    inhabitants: 'Ozarans',
    image: "/src/assets/planets/Ozara.jpg",
    planetDescription: `
    Ozara is a desert planet consisting mainly of sand. Life is scarce, and water is more so. The sands of Ozara shift like waves, creating massive, ever-changing dunes. Geological markers show that the planet once contained large bodies of water, but it isn’t known where this water went, or why the planet is now so dry. All that is left of these great oceans are massive salt flats and deep gorges. Canyons that were once carved by water are now eroded by powerful sandstorms. The sand on the surface is multi-colored due to the planet’s many metal and mineral deposits, creating rainbow patterns in the ever-changing landscape.
    An assortment of small insects, reptiles, and mammals scavenge the planet’s surface at night, collecting the dew that forms on the sparse grasses and cacti that grow in select valleys. Apart from a large underground network of desert mycelium, plant and animal life on Ozara is small and rare.
    `,
    inhabitantsDescription: `
    The Ozaran people are lean and slender, and they protect their bodies from the oppressive desert sun by wearing garments made from the fibers of desert grasses. They adorn themselves with jewelry made of gold and copper, two abundant metals on Ozara. They cover their faces whenever outside with scarves or glass masks to protect them from windborne sand.


    They mainly live underground, in a network of caves created by hollowing out sections of the enormous root-like underground mycelium. Every morning, large canvases are placed on the mycelium walls, and the moisture they trap is wrung out every night, providing a small but steady supply of water. Though the planet is rich in metals, the Ozara people have not experimented beyond smelting softer alloys. A technologically advanced civilization once inhabited the planet, as evidenced by a few leftover objects scattered in the sand and some buried ruins now used as meeting places. There are no records of what led to the civilization’s downfall; however, it is known that the planet’s current inhabitants are their descendants.
    `,
    cx: 9, cy: 127, r: 8.5, innerR: 4.5
  },
  {
    planetNumber: 2,
    name: 'Sindari',
    terrain: 'Volcanic',
    coordinates: '8439, 866B, 29083F',
    circumference: '94,675 AU',
    inhabitants: 'Sindarins',
    image: "/src/assets/planets/Sindari.jpg",
    planetDescription: `
    Sindari is a dark planet, teeming with volcanic activity. The fumes and ash from the planet’s many volcanoes have all but blocked out the sun. Rivers of lava flow into acidic lakes on the north side of the planet, where large trees protected by thick, charred bark thrive. These leafless trees are home to several species of lizards and birds with thick reptilian skin, as well as a few small mammals. What little sunlight makes it to the planet’s surface is pale in the morning and deep red throughout most of the day. The volcanic soil is rich in nutrients, creating an environment that allows microorganisms to flourish and release breathable oxygen. `,
    inhabitantsDescription: `
    The inhabitants of Sindari reflect their environment, with obsidian-black hair and sturdy lungs that can tolerate large amounts of volcanic gas. They are tall and muscular, and much of their diet consists of reptile eggs and tubers that grow deep in the volcanic soil. The Sindari people are warriors, adept at fighting and creating weapons. They are ruthless in combat, and any fight, no matter how small, is a fight to the death.
    As a result, disputes among Sindari communities are rare, and patience is revered. They wear crimson armor made from the leather of large reptiles. Their many layers of clothing protect their pink skin from the harsh climate and volcanic heat. They have developed steam power, and they use geothermal aquifers to power mills which transform volcanic rock into metals and sulfur-based polymers.
    `,
    cx: 18, cy: 18, r: 12.5, innerR: 6.75
  },
  {
    planetNumber: 3,
    name: 'Kitas',
    terrain: 'Ice',
    coordinates: '9078C, 222C, 8895V',
    circumference: '40,075 km',
    inhabitants: 'Kitans',
    image: "/src/assets/planets/Kita.jpg",
    planetDescription: `
    Kita is a planet of eternal winter. Glaciers make up much of the terrain. Mountains of snow and cliffs of sheer ice cover the planet, along with vast, uninterrupted flatlands that reflect an icy blue light. Frozen lakes of ammonia and carbon dioxide can be found on the poles of the planet, which remain significantly colder than the still-icy equator. The average temperature on the planet is rarely above freezing.
    Although there is little precipitation, small streams of liquid water can be found in the glacial chasms that form near the equator, where most life is concentrated. Small trees and bushes grow in the nutrient-rich permafrost located in the equatorial ravines. Arctic foxes and small mammals make their homes in caves, shielded from the biting winds. There is virtually no distinction between seasons on Kita, leaving the cryosphere remarkably unchanged over the last seven million years.
    `,
    inhabitantsDescription: `
    The inhabitants of Kita are technologically advanced, though they have not achieved space travel. Their environment has forced them to become expert builders, as they must insulate their ice caves to create large climatized structures where they spend most of their time. They have pale skin that burns easily on the reflective surface of the ice. They wear heavy clothing made from the plant fibers of snow bushes and the fur of foxes to keep them warm.
    Kitans live in colonies along the planet’s equator, encircling the planet in a narrow ring of interconnected underground dwellings. This system of habitations is so vast that inhabitants claim they can circumnavigate the entire planet without having to walk more than fifty miles in open terrain. Kitans have many rules regarding cultural etiquette, known collectively as Edjuwei, or “ice honor,” which dictate most aspects of life, including water gathering rituals, how to resolve disputes, and standards of hospitality toward strangers. They adhere rigidly to these customs, and any major deviation from tradition is met with a death sentence: exile to the elements.`,
    cx: 87, cy: 29, r: 12.5, innerR: 6.75
  },
  {
    planetNumber: 4,
    name: 'Lusa',
    terrain: 'Water',
    coordinates: '12322, 23frsd, 12233r2n',
    circumference: '40,075 km',
    inhabitants: 'Lusans',
    image: "/src/assets/planets/Lusa.jpg",
    planetDescription: `
    Almost entirely covered in a seemingly bottomless ocean, Lusa is inhabited by myriad sea life. What little land is present consists of shallow swampland that never dries out for more than a day. Tall, sharp grasses grow on these marshes. Storms often cause towering waves, and major meteorological events can last for weeks without relenting. In the depths of the ocean, fish, squid, crabs, and sponges can grow hundreds of times the size of their shallow-water relatives.
    Once a year, the planet’s three moons align, reflecting silver light on the surface of the ocean, luring enormous creatures from the deep to shallow waters and onto the marshlands. Plots of seaweed and colonies of marine invertebrates are scattered across the planet’s southern hemisphere, while the Northern hemisphere is mainly open ocean, with few humanoid outposts.
    `,
    inhabitantsDescription: `
    The Lusans have evolved to live semi-aquatic lives. They have delicate dermal tissue which grants them the ability to breathe through their skin, allowing them to dive for extended periods of time. Their long silver hair aids them in hunting underwater, enabling them to sense micro-shifts in the water’s current, and their diet consists entirely of fish and seaweed.
    Many of Lusa’s inhabitants live on the marshlands, fashioning traditional domed homes from mud and grasses. Their society is technologically advanced, though they have not achieved space travel. They create large steel structures that can house thousands, anchored to rocks in the northern sea. They are adept at radio communication, and nearly every Lusan carries a communication device called a “trisstor,” translated loosely as “shell.” They are currently at peace, though in the past they have fought many wars over ocean territory. Their weapon of choice is the trident.
    `,
    cx: 96, cy: 95, r: 11.5, innerR: 6
  },
  {
    planetNumber: 5,
    name: 'Zando',
    terrain: 'Jungle',
    coordinates: '5900, 2907K, 3399G',
    circumference: '14,775 AU',
    inhabitants: 'Zandoans',
    image: "/src/assets/planets/Zando.jpg",
    planetDescription: `
    Zando is a lush rainforest, overflowing with life. Tall trees intertwine to form continent-spanning canopies, with vines and large-leafed bushes growing on the forest floor. The planet has  no saltwater oceans. Instead, large rivers with fast-moving rapids and stunning waterfalls cut through the tropical forests before emptying into enormous freshwater lakes.
    There are millions of species of exotic birds, bright-colored tree frogs, insects, and other jungle-dwelling animals on Zando. The southern hemisphere is home to a species of giant sloths that are capable of living hundreds of years due to their incredibly slow metabolisms and lack of natural predators. In the northern hemisphere, there is a large crater visible from space, formed by the collision of a meteor containing large quantities of nitrogen. The dispersion of nitrogen throughout the atmosphere is believed to be what caused such an explosion of life on Zando.
    `,
    inhabitantsDescription: `
    The inhabitants of Zando adorn their clothing with leaves to match their surroundings. Although they are not technologically advanced, they have learned to live in harmony with their world. Much of their life revolves around foraging in the treetops and bushes for food. Their diet consists mainly of fruits, nuts, and the small animals they hunt using their bows or small silver swords.
    The Zandoans sleep in woven hammocks hung from branches in the tall canopy trees. They often befriend animals, caring for wounded creatures and nursing them back to health. Many tribes exist on the planet, though most are isolated from each other geographically. The tribes have formed a loose collective government, with treaties dictating territorial movements. The people of Zando have one of the longest lifespans among the ten planets, partially due to the abundance of natural resources provided to them by their planet.
    `,
    cx: 178, cy: 128, r: 10.5, innerR: 5
  },
  {
    planetNumber: 6,
    name: 'Crutha',
    terrain: 'Mountainous',
    coordinates: '8339, 12f7d, 4093r',
    circumference: '100,075 AU',
    inhabitants: 'Cruthans',
    image: "/src/assets/planets/Crutha.jpg",
    planetDescription: `
    Crutha has one of the harshest terrains of the ten planets. Its surface is covered in rocky, uneven terrain. Large crevices crisscross the planet, punctuated by mountains and vertical cliffs. Mist and fog cover most of the ground, making it difficult for plants and humanoids to survive. The sky appears orange due to ever-present clouds in the lower atmosphere.
    Crutha has higher than average surface gravity due to its large planetary mass. Few plants grow on the surface, but many fungi grow underground and in dark caves. The largest animal on the surface is the long-haired mountain goat, which forages for fungi that grow in the crevices between rocks. The geological composition of the planet is roughly half granite, with the rest made up of granodiorite, basalt, and various other minerals.
`,
    inhabitantsDescription: `
    The Cruthans are very serious people, and they rarely laugh. Their skin is weathered and cracked due to the high altitude of their settlements and the constant exposure to harsh winds. Their blue-gray skin resembles the rocks they live among, and their hair is jet-black and often worn long.  When they are younger, Cruthans are small and thin. During late adulthood, they undergo a biological process that causes their muscles to grow three times as large. This process is known as "The rite of Ku'er," and it occurs in both males and females.
    Cruthan culture is agrarian, with major holidays coinciding with the cultivation and harvest of the gray, bulbous fungi that serve as their main food source. Once a year, Cruthan tribes gather on the largest plateau located in the southern hemisphere and compete in various sporting events, such as running, climbing, and hand-to-hand combat. Each tribe sets aside a portion of its food supply throughout the year, which is then given to the winning tribe.
    `,
    cx: 166, cy: 16, r: 11.5, innerR: 6
  },
  {
    planetNumber: 7,
    name: 'Pampas',
    terrain: 'Meadows',
    coordinates: '5554, 67D98, 5346H',
    circumference: '100,766 AU',
    inhabitants: 'The Ozari',
    image: "/planets/Pampas.jpg",
    planetDescription: `
    Pampas has a moderate climate characterized by warm days and mild nights. Although ice sheets form on the poles, much of the surface has a uniform temperature due to the planet's nearly perfect tilt in relation to its orbit. During the day, the sun shines on the grasslands, evaporating water into clouds. At night, the light of the planet's four moons shines on the hillsides as the clouds condense and release light rain. There are no discernible seasons on Pampas, and the planet's consistent sunlight and predictable rains make it the perfect place for plants to grow. Rolling green meadows cover much of the planet, punctuated by small mountain ranges. Although there are large forests and vast oceans, most of the planet is grasslands. Large grazing animals thrive on Pampas, roaming the planet from pole to pole.`,
    inhabitantsDescription: `
    The Pampans are short, good-natured people who value laughter and play above all else. Though they will work long days tending to their fields and animals when necessary, they spend most of their time telling stories and singing. Because there are no seasons on Pampas, the people move often, exploring the vast fields of their planet. They live in small cabins or grass huts, most of which have been around for centuries. There is no concept of homeownership among Pampans. They view homes as communal property, maintaining them well and moving into and out of them freely.
    One of the few dangers the Pampans face is a lethal illness called the scorm. Though rare, it is caused by arsenic compounds that build up in the grasslands around the mountains in the northern hemisphere. Most Pampans brew a beverage made of fermented grain and fruit that acts as a natural chelating agent, protecting drinkers from developing the illness.
    `,
    cx: 304, cy: 17, r: 16.5, innerR: 10
  },
  {
    planetNumber: 8,
    name: 'Minas',
    terrain: 'Asteroid',
    coordinates: '44434, 97A66, 1328H',
    circumference: '4,777 AU',
    inhabitants: 'Minasans',
    image: "/src/assets/planets/Minas.jpg",
    planetDescription: `
    Minas, technically classified as a dwarf planet, is the smallest of the ten planets. It has a cratered surface, resembling a large asteroid. The gravity on Minas is low, and the atmosphere is very thin. There are only a few plants that grow on the planet's surface, and most of them are large, rock-like succulents. The inhabitants of Minas have filled the atmosphere with oxygen, displacing the neon gas that used to surround the planet. The surface of Minas is rich in minerals and various metallic ores. Though small, Minas has several moons which orbit the planet. Minas and its moons were once two larger planets that collided several billion years ago. There is very little water that pools on the planet’s surface, but water and ice are present in the soil of Minas.
    `,
    inhabitantsDescription: `
    The inhabitants of Minas are a hard-working, technically advanced people. Life on Minas is strenuous and depends on the constant mining and extraction of water, minerals, and chemical compounds necessary for survival. They have achieved space flight, though they don’t travel very far. They possess extensive knowledge of engineering and chemistry, and much of their culture revolves around the maintenance schedules of their mining equipment.  The standard uniform for an inhabitant of Minas is a red mining uniform with a white helmet.
    They live in small habitation units, usually located next to their mines. They can synthesize food, allowing them to supplement the limited supply of edible plants and rodents on the planet. Along with Gredica and Cristall, Minas is a member of the Triad Alliance of Planets, an interplanetary treaty for trade and governance. Before the Warp occurred, the Triad Alliance planets believed themselves to be the only life in the universe. Minas often exports chemical compounds and raw materials to the other members of the Triad Alliance in exchange for goods and technology.
    `,
    cx: 291, cy: 112, r: 20.5, innerR: 13
  },
  {
    planetNumber: 9,
    name: 'Gredica',
    terrain: 'Flowerbeds',
    coordinates: '1998F, 2777D, H778R',
    circumference: '102,099 AU',
    inhabitants: 'The Ozari',
    image: "/planets/Gredica.jpg",
    planetDescription: `
    Gredica is one of the most peculiar of the 10 planets, and it is characterized by its pink fog and multitude of flowers. Resembling multi-colored daisies, the flowers are part of a single clonal organism that covers most of the low-altitude surface of the planet. The flowers emit spores, creating plumes of pink haze that surround the planet. These spores attach to organic matter, allowing the flowers to spread quickly, decomposing anything in their path in a matter of days. The flowers do not grow in the mountains or any of the planet’s lakes or rivers. There are many deer, small rabbits, and dragon flies on the planet that are immune to the decompositional effects of the spores.`,
    inhabitantsDescription: `
    Gredicans are technologically advanced and live in large structures high in the mountains. They were one of the first of the ten planets to achieve space flight. All Gredicans wear spacesuits outside to protect themselves against the deadly pink spores that fill the atmosphere. When inhaled, the spores have an opioid effect, inducing drowsiness. Unprotected individuals will eventually fall asleep and become covered by flowers, decomposing within a few days. Due to this danger, Gredicans have developed a strong desire to explore other planets. In ancient times, Gredicans would consume a seaweed-based tea that provided them with a natural immunity to the pink fog. However, modern Gredicans avoid it as it significantly reduces their lifespan. Gredica is a member of the Triad Alliance of Planets, along with Minas and Cristall. In exchange for raw materials, Gredica provides manufacturing and technological services for the other two planets.`,
    cx: 390, cy: 113, r: 11.5, innerR: 6
  },
  {
    planetNumber: 10,
    name: 'Cristall',
    terrain: 'Crystal',
    coordinates: '12322, 23frsd, 12233r2n',
    circumference: '40,075 km',
    inhabitants: 'The Ozari',
    image: "/src/assets/planets/Cristall.jpg",
    planetDescription: `
      The planet has large deposits of quartz-like, clear crystals on its surface. Some crystals are the size of mountains, piercing out through the ground. Some are small and appear like patches of plants. The Crystals scatter a pinkish-purple light when light is shone through them.
      The ground is made up of white-grey gravel rock.
      The planet is far from a sun, and is mainly illuminated by its 2 moons, appearing in the sky as round discs of light. The moons are always full. One is about 1/2 the size as the other. There are many stars in the sky.
      The sky is a purple-pink color, fading to black.`,
    inhabitantsDescription: `
      The inhabitants are very technologically advanced.
      They are scientists primarily, and their culture is devoted to the exploration and classification of their planet and surrounding system. They have achieved spaceflight, but only venture as far as their planet’s twin moons.
      They wear white, well-fitting coveralls.
      Their hair is pink.
      Their skin is a very light pinkish purple.
      They wear a quartz crystal pendant around their necks.`,
    cx: 409, cy: 14, r: 8.5, innerR: 5
  },
] as PlanetProps[];
