// Popular NFT collections - centralized list used across the app
export interface NFTCollection {
    name: string
    symbol: string
    address: string
    items?: number
    baseFloor?: number
    baseVolume?: number
    owners?: number
}

export const POPULAR_COLLECTIONS: NFTCollection[] = [
    { name: 'Bored Ape Yacht Club', symbol: 'BAYC', address: '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D', items: 10000, baseFloor: 28, baseVolume: 450, owners: 5432 },
    { name: 'CryptoPunks', symbol: 'PUNK', address: '0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB', items: 10000, baseFloor: 48, baseVolume: 380, owners: 3892 },
    { name: 'Mutant Ape Yacht Club', symbol: 'MAYC', address: '0x60E4d786628Fea6478F785A6d7e704777c86a7c6', items: 19423, baseFloor: 5.2, baseVolume: 320, owners: 13456 },
    { name: 'Azuki', symbol: 'AZUKI', address: '0xED5AF388653567Af2F388E6224dC7C4b3241C544', items: 10000, baseFloor: 6.8, baseVolume: 290, owners: 5234 },
    { name: 'Pudgy Penguins', symbol: 'PPG', address: '0xBd3531dA5CF5857e7CfAA92426877b022e612cf8', items: 8888, baseFloor: 9.2, baseVolume: 185, owners: 4532 },
    { name: 'Doodles', symbol: 'DOODLE', address: '0x8a90CAb2b38dba80c64b7734e58Ee1dB38B8992e', items: 10000, baseFloor: 2.8, baseVolume: 120, owners: 5678 },
    { name: 'Clone X', symbol: 'CloneX', address: '0x49cF6f5d44E70224e2E23fDcdd2C053F30aDA28B', items: 19434, baseFloor: 2.1, baseVolume: 95, owners: 9234 },
    { name: 'Moonbirds', symbol: 'MOONBIRD', address: '0x23581767a106ae21c074b2276D25e5C3e136a68b', items: 10000, baseFloor: 1.9, baseVolume: 78, owners: 6543 },
    { name: 'Otherdeed for Otherside', symbol: 'OTHR', address: '0x34d85c9CDeB23FA97cb08333b511ac86E1C4E258', items: 100000, baseFloor: 0.68, baseVolume: 145, owners: 34567 },
    { name: 'Cool Cats', symbol: 'COOL', address: '0x1A92f7381B9F03921564a437210bB9396471050C', items: 9999, baseFloor: 0.89, baseVolume: 42, owners: 5678 },
    { name: 'World of Women', symbol: 'WOW', address: '0xe785E82358879F061BC3dcAC6f0444462D4b5330', items: 10000 },
    { name: 'VeeFriends', symbol: 'VEE', address: '0xa3AEe8BcE55BEeA1951EF834b99f3Ac60d1ABeeB', items: 10255 },
    { name: 'Meebits', symbol: 'MEEB', address: '0x7Bd29408f11D2bFC23c34f18275bBf23bB716Bc7', items: 20000 },
    { name: 'Art Blocks Curated', symbol: 'BLOCKS', address: '0xa7d8d9ef8D8Ce8992Df33D8b8CF4Aebabd5bD270', items: 150000 },
    { name: 'Loot', symbol: 'LOOT', address: '0xFF9C1b15B16263C61d017ee9F65C50e4AE0113D7', items: 8000 },
]
