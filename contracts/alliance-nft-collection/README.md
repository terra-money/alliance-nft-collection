# Alliance NFT

Reward NFT collection to the participants from [Game Of Alliance](https://docs.alliance.terra.money/game-of-alliance/overview/) that helped to test the [Alliance module](https://github.com/terra-money/alliance). Each NFT will receive staking rewards from Terra Blockchain and will also enable voting in the Alliance DAO.

## Update 1.1.0

Update 1.1.0 introduces the staking of rewards in the ERIS LUNA Amplifier. This allows the DAO to participate in compounding staking rewards.

### New features

- **StakeRewardsCallback**: This execution will check if LUNA are in the contract and then stake the available amount in the LST. It will call the `UpdateRewardsCallback` with the `previous_lst_balance` to track how many ampLUNA have been added to the rewards.

- **UpdateRewardsCallback**: Instead of storing the LUNA balance in a temporary state, the previous ampLUNA balance is being sent to the `UpdateRewardsCallback`. This way the contract is more gas-efficient and simplified.

- **UpdateConfig**: The owner is allowed to update the config with the following properties
  - `dao_treasury_share`: Specifies how much of the alliance staking rewards should be distributed to the dao treasury.
  - `set_whitelisted_reward_assets`: Sets all whitelisted reward assets that should be checked for distribution when breaking an NFT. 
  - `add_whitelisted_reward_assets`: Adds whitelisted rewards assets to the cfg stored.

- **BreakNft**: On breaking an NFT, a user receives their share in ampLUNA. The user also receives their share of all whitelisted reward assets. The user's reward share is calculated by dividing their rewarded ampLUNA by the total amount of ampLUNA in the contract.

### Additional Changes

- Removed non-used state constants (UNBONDINGS, REDELEGATIONS)
- Removed TEMP_BALANCE, as the previous balance is being sent directly in the callback message.
- REWARD_BALANCE holds the amount of LST per unbroken NFT instead of the amount of LUNA.
- NFT minter contract is now forwarding migrations to the nft collection if specified.

### Migration

The migration requires the following fields under the version110_data.

- **dao_treasury_address**: Specifies the DAO treasury for the reward sharing.
- **dao_treasury_share**: Specifies the amount of rewards to be shared with the DAO treasury (0-20%).
- **lst_hub**: Specifies the ERIS liquid staking hub contract address.
- **lst_asset_info**: Specifies the AssetInfo of ampLUNA. 
