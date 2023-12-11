export interface NFTType {
  id: number;
  planet: string;
  image: string;
  biome: string;
  character: string;
  object: string;
  rarityScore: number;
  rewards: number;
  claimed: string;
}

export const mockNFTs = [
  {
    id: 0,
    planet: "Cristall South",
    image: "/src/assets/nfts/MOUNTAINS 2 1.png",
    biome: "water",
    character: "Kitan F",
    object: "Quartz Ray Gun",
    rarityScore: 0.4,
    rewards: 89.49,
    claimed: "24 December 2023"
  },
  {
    id: 1,
    planet: "Crutha South",
    image: "/src/assets/nfts/MOUNTAINS 2 2.png",
    biome: "fire",
    character: "Cristallian F",
    object: "Sword of Zando",
    rarityScore: 0.4,
    rewards: 89.49,
    claimed: "24 December 2023"
  },
  {
    id: 2,
    planet: "Kita South",
    image: "/src/assets/nfts/MOUNTAINS 2 3.png",
    biome: "ice",
    character: "Kitan M",
    object: "Staff of Zando",
    rarityScore: 0.4,
    rewards: 89.49,
    claimed: "24 December 2023"
  },
  {
    id: 3,
    planet: "Kita North",
    image: "/src/assets/nfts/MOUNTAINS 2 4.png",
    biome: "jungle",
    character: "Kitan F",
    object: "Kitan Ice Staff",
    rarityScore: 0.4,
    rewards: 89.49,
    claimed: "24 December 2023"
  },
  {
    id: 4,
    planet: "Ozara South",
    image: "/src/assets/nfts/MOUNTAINS 2 5.png",
    biome: "mountain",
    character: "Pampan M",
    object: "Cristallian Bow",
    rarityScore: 0.4,
    rewards: 89.49,
    claimed: "24 December 2023"
  },
  {
    id: 5,
    planet: "Zando North",
    image: "/src/assets/nfts/MOUNTAINS 2 1second.png",
    biome: "meadows",
    character: "Lusan M",
    object: "Ice Cleaver",
    rarityScore: 0.4,
    rewards: 89.49,
    claimed: "24 December 2023"
  },
  {
    id: 6,
    planet: "Sindari North",
    image: "/src/assets/nfts/MOUNTAINS 2 2second.png",
    biome: "asteroid",
    character: "Sindarin M",
    object: "Ice Cleaver",
    rarityScore: 0.4,
    rewards: 89.49,
    claimed: "24 December 2023"
  },
  {
    id: 7,
    planet: "Sindari South",
    image: "/src/assets/nfts/MOUNTAINS 2 3second.png",
    biome: "flowerbeds",
    character: "Gredican M",
    object: "sword",
    rarityScore: 0.4,
    rewards: 89.49,
    claimed: "24 December 2023"
  },
  {
    id: 8,
    planet: "Minas South",
    image: "/src/assets/nfts/MOUNTAINS 2 4second.png",
    biome: "crystal",
    character: "Kitan F",
    object: "Pampan Grass Sword",
    rarityScore: 0.4,
    rewards: 89.49,
    claimed: "24 December 2023"
  },
  {
    id: 9,
    planet: "Ozara South",
    image: "/src/assets/nfts/MOUNTAINS 2 5second.png",
    biome: "desert",
    character: "Gredican F",
    object: "Sindarin Fire Staff",
    rarityScore: 0.4,
    rewards: 89.49,
    claimed: "24 December 2023"
  },
  {
    id: 10,
    planet: "Ozara North",
    image: "/src/assets/nfts/MOUNTAINS 2 1third.png",
    biome: "fire",
    character: "Gredican F",
    object: "Phoenix Rising",
    rarityScore: 0.4,
    rewards: 89.49,
    claimed: "24 December 2023"
  },
  {
    id: 11,
    planet: "Gredica North",
    image: "/src/assets/nfts/MOUNTAINS 2 2third.png",
    biome: "water",
    character: "Cruthan F",
    object: "Lusan Xtreme Soaker",
    rarityScore: 0.4,
    rewards: 89.49,
    claimed: "24 December 2023"
  },
  {
    id: 12,
    planet: "Gredica South",
    image: "/src/assets/nfts/MOUNTAINS 2 3third.png",
    biome: "water",
    character: "fire",
    object: "Golden Hammer",
    rarityScore: 0.4,
    rewards: 89.49,
    claimed: "24 December 2023"
  },
  {
    id: 13,
    planet: "Crutha North",
    image: "/src/assets/nfts/MOUNTAINS 2 4third.png",
    biome: "water",
    character: "Minas M",
    object: "Sindarin Flame Thrower",
    rarityScore: 0.4,
    rewards: 89.49,
    claimed: "24 December 2023"
  },
  {
    id: 14,
    planet: "Pampas South",
    image: "/src/assets/nfts/MOUNTAINS 2 5third.png",
    biome: "water",
    character: "Minas M",
    object: "Cruthan Death Mace",
    rarityScore: 0.4,
    rewards: 89.49,
    claimed: "24 December 2023"
  },
] as NFTType[];

export const signedInUserData = {
  id: 0,
  username: "test",
  email: "",
  nftIDs: [3, 4],
}
