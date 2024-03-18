# Alliance NFT

Reward NFT collection to the participants from [Game Of Alliance](https://docs.alliance.terra.money/game-of-alliance/overview/) that helped to test the [Alliance module](https://github.com/terra-money/alliance). Each NFT will receive staking rewards from Terra Blockchain and will also enable voting in the Alliance DAO.

## Update 1.1.0

Update 1.1.0 introduces staking of rewards in the ERIS LUNA Amplifier. This allows the DAO to participate in compounding staking rewards.

New features:

- **StakeRewardsCallback**: This execution will check if LUNA are in the contract, and stake the amount that is available in the LST. It will call the UpdateRewardsCallback with the previous_lst_balance to track how many ampLUNA have been added to the rewards.

- **UpdateRewardsCallback**: Instead of storing the LUNA balance in a temporary state, the previous ampLUNA balance is being sent to the UpdateRewardsCallback. This way the contract is more gas efficient and simplified.

- **UpdateConfig**: The owner is allowed to update the config with the following properties
  - "dao_treasury_share": Specifies how much of the alliance staking rewards should be distributed to the dao treasury.
  - "set_whitelisted_reward_assets": Sets all whitelisted reward assets that should be checked for distribution during breaking an NFT
  - "add_whitelisted_reward_assets": Adds whitelisted rewards assets to the cfg stored.

- **BreakNft**: On breaking a NFT a user receives their share in ampLUNA. Further he receives his share of all whitelisted reward assets too. His share is calculated by deviding his rewarded ampLUNA by the total amount of ampLUNA in the contract.

Additional Changes:

- Removed non-used state constants (UNBONDINGS, REDELEGATIONS)

- Removed TEMP_BALANCE, as the previous balance is being sent directly in the callback message.

- REWARD_BALANCE holds the amount of LST per unbroken NFT instead of the amount of LUNA.

- NFT minter contract is now forwarding migrations to the nft collection if specified.
