import { AccAddress } from "@terra-money/feather.js"

type AllianceConfig = {
  contracts: AllianceContractConfig
}

type AllianceContractConfig = {
  minter: AccAddress
  collection: AccAddress
  dao: AccAddress
}

const testnet: AllianceConfig = {
  contracts: {
    minter: "terra1sas7np0ze3cwyd26lhhtp5h88fscv8rldezq74zcec8s7lxar0jq2q4u7d",
    collection:
      "terra18gv7neq9dmzrwz6jdpnu7rwg0t99h70c4xkrn5m7tqe9e9z4nv2qcrp0u5",
    dao: "terra1tay6vaymstcg95z4lwpaxujhzsnqylu39hl3328556y5edzsf8ysuzrtnq",
  },
}

export default testnet
