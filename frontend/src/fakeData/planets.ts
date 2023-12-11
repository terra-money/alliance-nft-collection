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
    coordinates: '12322, 23frsd, 12233r2n',
    circumference: '40,075 km',
    inhabitants: 'The Ozari',
    image: "/planets/Ozara.jpg",
    planetDescription: `
      The planet is littered with ruins of a civilization that imploded thousands of years ago. The ruins are half buried and made of stone. Inhabitants of this planet live mainly underground and in the ruins.
      There are several dried seabeds that cover the surface containing miles-long stretches of salt deposits. The salt flats are white and reflect the sun.
      There is some sagebrush that grows near canyons. Several species of cactus live on the surface, but they are few and far between.
      The walls of canyons reveal many layers of different colored sands. The sides of some sand dunes reveal blue, pink, red, green, and yellow sand.`,
    inhabitantsDescription: `
      The inhabitants cover every inch of exposed skin in a reflective rose-gold dust mixed into a lotion, making their faces and hands shine rose-gold. This reflects much of the oppressive sunlight.
      They have blue eyes.
      Their hair is dark, and they often wear white scarves around their hair to protect it from the sun.
      Their clothing is made of white or sand-colored linen and muslin wraps. On their clothing, down their spine is a pattern of red or gold characters in an ancient script.
      They wear a belt made of braided gold, tied around their waists. They wear a few dark leather pouches, tied to their belts, hanging from their sides.
      They wear light sandals with gold straps.
      They are thin, slender, and of average height.`,
    cx: 9, cy: 127, r: 8.5, innerR: 4.5
  },
  {
    planetNumber: 2,
    name: 'Krimsen',
    terrain: 'Fire',
    coordinates: '12322, 23frsd, 12233r2n',
    circumference: '40,075 km',
    inhabitants: 'The Ozari',
    image: "/planets/Krimsen.jpg",
    planetDescription: `
      Dark planet with lots of geological activity. The fumes from volcanoes have nearly blocked out the sun. The sky that can be seen through the plumes of ash is a fierce red-orange during the day, fading to pink at sunset and purple at night.
      Large trees grow there, their barks permanently charred and thin angular branches resemble trees after forest fires. The leaves on these trees have an ash-grey or pale blue underside with orange and gold veins, which almost appear glowing.
      The system has three suns of various sizes, appearing as the points of a small equilateral triangle in the sky.
      There are lots of dark cliffs and volcanos. Lava rivers form in some valleys. The ground is dark, made up of obsidian and shale fragments.
      There is a large dark lake on the surface.
      This planet has a Mordor vibe.`,
    inhabitantsDescription: `
      These humanoids have evolved to match their planet, where there are many volcanoes, and the sky is filled with dark smoke.
      Their skin is reddish with a hint of pink and are very muscular.
      They are the largest humanoids of the 10 planets.
      Their hair is black, wavy, and long, traditionally worn down, with one thin braid on the side of their heads.
      They do not wear head covering.
      Their faces are angular and chiseled, with strong, powerful jaws.
      They must wear well-fitted protective armor made from the thick, hard scales of a dragon-like creature found on their planet. Their armor appears scorched and is dark like charcoal, with thin gold veins visible on the armor’s surface.
      Below their armor they wear a faded red tunic.
      They are fierce and serious. Life is very difficult on their planet, as their environment is unforgiving. Though they are fearsome, they choose to avoid conflict if possible, as their strength is great, and disputes are deadly.`,
    cx: 18, cy: 18, r: 12.5, innerR: 6.75
  },
  {
    planetNumber: 3,
    name: 'Kita',
    terrain: 'Ice',
    coordinates: '12322, 23frsd, 12233r2n',
    circumference: '40,075 km',
    inhabitants: 'The Ozari',
    image: "/planets/Kita.jpg",
    planetDescription: `
      Think Hoth from Star Wars.
      Glaciers make up much of the terrain. Mountains of snow and cliffs of ice cover the planet, along with long, uninterrupted flatlands of snow.
      Some large structures are made of clear ice, appearing against the sky like crystal castles in the background. These were constructed long ago by the inhabitants of the ice planet.
      There are a few pine-like trees with greenish-white needles and red berries that grow along icy cliffsides. These trees are more like bushes. Arctic foxes are the most common animal.
      The snow and ice have a blue-ish tint to them. Some glaciers may have a faint green in them as well.
      The sky is blue, with a few wispy clouds. Occasionally it snows, though there are usually never any significant clouds in the sky. The sky is dark at night, and the moon glows yellow. Sometimes a green aurora borealis can be seen in the sky.`,
    inhabitantsDescription: `
      Light blue skin, like frost.
      Bright yellow eyes
      Their hair is white.
      The men have white beards.
      They wear tiaras on their heads made from a material that looks like a mix of bones, silver, and ice.
      They are somewhat technologically advanced, though they have not achieved space travel.
      Their clothing is layered. Arctic fox pelts adorn their shoulders for added warmth.`,
    cx: 87, cy: 29, r: 12.5, innerR: 6.75
  },
  {
    planetNumber: 4,
    name: 'Lusa',
    terrain: 'Water',
    coordinates: '12322, 23frsd, 12233r2n',
    circumference: '40,075 km',
    inhabitants: 'The Ozari',
    image: "/planets/Lusa.jpg",
    planetDescription: `
      The planet is almost entirely covered in water. Storms often cause large waves. The water is very deep, and many fish and sea plants thrive in the ocean. What little land there is is shallow swampland, never drying out for more than a day. Tall sharp Grasses grow on these marshes.
      The inhabitants live on large floating islands they make by weaving marshland grasses. Many of the structures on these islands are made of mud and grass, formed in organic, domed shapes Think of termite mounds or swallows nests.
      Tall structures emerge from the ocean in some places, made from a dark metallic substance, resembling castings of termite mounds or the watts towers. Nobody knows who made them.
      One structure resembles a tiered cake with walls of thick glass. The structure is filled with sea water, and is a type of terraced sea-garden, where a variety of underwater plants grow and thrive due to the abundance of sunshine they receive through the clear walls.`,
    inhabitantsDescription: `
      They have skin that is blue and silvery like fish scales.
      Their necks have a few rows of gills, but they are subtle.
      Their hands are webbed for swimming
      They are tall and slender
      The women have long-flowing grey-blue and silver hair with a few streaks of color.
      The men have short (1.5 inches), grey-blue hair that stands straight up. In their hair they have some small spots of orange.
      They wear well-fitting wet suits made of a blue material.
      They carry a large knife on their belts
      They wear a necklace of sea shells around their necks and around their left ankles.`,
    cx: 96, cy: 95, r: 11.5, innerR: 6
  },
  {
    planetNumber: 5,
    name: 'Zando',
    terrain: 'Jungle',
    coordinates: '12322, 23frsd, 12233r2n',
    circumference: '40,075 km',
    inhabitants: 'The Ozari',
    image: "/planets/Zando.jpg",
    planetDescription: `
      This planet is a lush rainforest. There are very tall trees which make up the canopy of the forest, and vines and large-leafed bushes growing on the surface. A lot of the surface between the plants is dead leaves, and the plants grow with some space around them.
      There are large rivers which cut through the forests, with fast-moving rapids and occasional waterfalls.
      There are many species of exotic birds, bright colored tree frogs, insects, and other jungle-dwelling animals.`,
    inhabitantsDescription: `
      light green skin.
      long brown or blonde hair
      They have elvish features.
      They don’t have beards or facial hair.
      Their clothing is brown and dark green to blend into the forest.
      They aren’t very technologically advanced, but they have learned to live in harmony with their world.
      They are of medium height and build, and can walk silently in the forest.
      They live in huts or hollow trees.
      They often hunt with bows or carry delicate swords made of silver.`,
    cx: 178, cy: 128, r: 10.5, innerR: 5
  },
  {
    planetNumber: 6,
    name: 'Crutha',
    terrain: 'Mountain',
    coordinates: '12322, 23frsd, 12233r2n',
    circumference: '40,075 km',
    inhabitants: 'The Ozari',
    image: "/planets/Crutha.jpg",
    planetDescription: `
      The planet is covered in rocky, uneven terrain. Large crevices line the earth punctuated by cliffsides and mountains. Most of the terrain on this world is uneven, rarely being flat for more than a few feet. Mist and fog covers most of the ground, making it difficult for plants and humans to live on the
      The pillars: Most of civilization lives on large, hexagonal pillars of basalt high up.  Mountains can be seen in the distance. Below, there are dark, rocky ravines and canyons. In the distance, mountains can be seen.
      On monolithic cliffsides, there are some civilizations that live in networks of caves.
      Twin moons exist, shedding pale moonlight in a purple-black sky.
      Large mountain goats are the main animal`,
    inhabitantsDescription: `
      They are very serious.
      their skin, including their face, is very weathered and cracked due to the high altitude and constant exposure to harsh winds.
      their skin is tinted grey-ish color that resembles the rocks they live around, and the cracks within their skin are a deep dark red
      They do not have any facial hair
      Everyone’s hair is pulled back into low, slicked back, tight ponytail. the hair color is greyish whits with black streaks/stripes running through it.
      They have red eyes.
      They wear form fitting clothes.
      They carry around small satchel backpacks that contain pick-axes, ropes, grappling hooks, and other climbing gear.
      They wear spiky/cleat shoes that aid in their climbing.`,
    cx: 166, cy: 16, r: 11.5, innerR: 6
  },
  {
    planetNumber: 7,
    name: 'Pampas',
    terrain: 'Meadows',
    coordinates: '12322, 23frsd, 12233r2n',
    circumference: '40,075 km',
    inhabitants: 'The Ozari',
    image: "/planets/Pampas.jpg",
    planetDescription: `
      The landscape looks like The Shire from LOTR.
      Vast meadows with golden and green grasses fill the large, flat areas between hills.
      There are some deciduous trees (maples and oaks with purple and green leaves) that grow, and there are creeks and small rivers that run though the grasslands.
      The sunlight is golden, shedding a nostalgic and happy glow over the world. The sky is blue, and there are a few fluffy clouds in the sky.
      There are two suns in the sky.
      There are small farms and pastoral cottages.`,
    inhabitantsDescription: `
      They are not technically advanced. They are mainly farmers.
      They are the smallest people in the 10 planets. They are shorter.
      They have brown or blonde curly hair.
      There eyes are green
      The male’s skin is light, and the female’s skin is dark
      Think hobbits from the shire.
      They go walk barefoot.
      They wear white linen shirts with some embroidery around the collars. Like a European peasant’s shirt.
      The men wear dark pants that go down to the middle of their shins.
      The women wear dresses.`,
    cx: 304, cy: 17, r: 16.5, innerR: 10
  },
  {
    planetNumber: 8,
    name: 'Minas',
    terrain: 'Asteroid',
    coordinates: '12322, 23frsd, 12233r2n',
    circumference: '40,075 km',
    inhabitants: 'The Ozari',
    image: "/planets/Minas.jpg",
    planetDescription: `
      The Asteroid surface looks like the surface of the moon. Grey-brown dusty rock with lots of craters.
      There are a few plants around. The plants look like large succulents, and they grow in a few sparse patches.
      There is no atmosphere, but the planet is covered in a transparent forcefield emanating from a pylon. The pylon is a column that extends into the sky from the surface of the planet.
      In the sky, a satellite can be seen. The satellite looks like the Terra Station logo.
      In the background, large mining equipment can be seen: An enormous truck full of coal with no wheels that floats. A giant drilling machine.`,
    inhabitantsDescription: `
      The inhabitants are hard working, technically-advanced people. Life on the asteroid is very rough. Much of the industry is mining to extract minerals necessary for survival.
      They have achieved space flight, though they can’t get very far. They have created settlements for mining on some other nearby rocks, but nobody lives there permanently.
      They have a space station that orbits the asteroid, allowing for communication and exploration/monitoring.
      They wear white helmets with headlamps for mining.
      They wear a utility belt with pockets for tools and supplies.
      The inhabitants wear red or yellow coveralls. Their coveralls have some dust and grease smudges, from the hard work in the mines.
      Their hair is brown.
      They have grey skin.`,
    cx: 291, cy: 112, r: 20.5, innerR: 13
  },
  {
    planetNumber: 9,
    name: 'Gredica',
    terrain: 'Flowerbeds',
    coordinates: '12322, 23frsd, 12233r2n',
    circumference: '40,075 km',
    inhabitants: 'The Ozari',
    image: "/planets/Gredica.jpg",
    planetDescription: `
      The planet surface often has a reddish-pink dust that rolls in like fog. It is a very light substance that is always floating and moving in the air.
      Flowers grow on most low-lying surfaces of the planet. They are all part of the same organism, a clonal organism, who is constantly spreading. The flowers can spread very fast, sometimes blooming in minutes. They look like daisies/marigolds/assortments of wildflowers.
      There are a few mountains and lakes. The flowers do not grow at higher altitudes or in water.
      The atmosphere is not suitable for human life without a spacesuit for longer than a few hours. The atmosphere causes humans to become dazed when exposed. After exposure, they get tired and lay down, their respiratory and cardiovascular functions slowing. After a few hours, the flowers will cover them and decompose the organic material completely in about 2 days.
      The inhabitants are technologically advanced and live in giant enclosed rectangular structures with walls and roof made of glass. They are single-level structures built to cover a large area, and are much wider than they are tall. Flowers can be seen on the bottom 1/4 of the structures exterior walls, but the rest of the walls and roof are free from them. The inhabitants have developed a type of glass that the flowers will not grow on.
      The sky is a pale pink hue for most of the day. Sunrise and sunset cause a vivid blue-green light. There is sunlight for most of the day.
      There are many deer, small rabbits, and dragon flies on the planet. They are immune to the effects of the atmosphere.`,
    inhabitantsDescription: `
      They wear advanced space suits that are very brightly colored.
      They wear gloves.
      They wear metal oxygen tanks on their backs. A small clump of blooming flowers can be seen stuck and growing from the surface of the tank.
      They are technologically advanced, making frequent trips to other planets in their system.
      They wear helmets, but they have no visors
      Their faces are tan and they are often smiling.`,
    cx: 390, cy: 113, r: 11.5, innerR: 6
  },
  {
    planetNumber: 10,
    name: 'Kristall',
    terrain: 'Crystal',
    coordinates: '12322, 23frsd, 12233r2n',
    circumference: '40,075 km',
    inhabitants: 'The Ozari',
    image: "/planets/Kristall.jpg",
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
