import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useWallet } from "@terra-money/wallet-kit"
import { useQueryClient } from "@tanstack/react-query"
import ConfettiExplosion from "react-confetti-explosion"
import { ReactComponent as Logo } from "assets/AllianceDAOLogo.svg"
import { ReactComponent as CheckIcon } from "assets/check.svg"
import { AnimatedBackground } from "components/background/AnimatedBackground"
import styles from "./ModalPage.module.scss"
import { useAllianceContracts, useNFTFromMinter } from "hooks/"
import { checkTxIsConfirmed } from "utils"
import { useAppContext } from "contexts"
import LoadingCircular from "components/loading/circular"

export const ClaimModalPage = () => {
  /* State */
  const [claimStatus, setClaimStatus] = useState<
    "notClaimed" | "claimed" | "error"
  >("notClaimed")
  const [claimAvailable, setClaimAvailable] = useState<boolean>(false)
  const [isPending, setIsPending] = useState<boolean>(false)
  const [, setIntervalId] = useState<number>()

  /* Use Hooks */
  const queryClient = useQueryClient()
  const { walletAddress, chainId, lcd } = useAppContext()
  const wallet = useWallet()

  const { mintNFT } = useAllianceContracts(walletAddress)
  const { data: dataForUser } = useNFTFromMinter(walletAddress)

  /* Effects */
  useEffect(() => {
    if (dataForUser) {
      setClaimAvailable(true)
    } else {
      setClaimAvailable(false)
    }
  }, [dataForUser, walletAddress, chainId])

  /* Handlers */
  const handleConnectClick = () => {
    if (walletAddress) {
      wallet.disconnect()
    } else {
      wallet.connect()
    }
  }

  const handleClaimClick = () => {
    if (walletAddress) {
      setIsPending(true)
      mintNFT()
        .then((status) => {
          if (status) {
            const id = window.setInterval(() => {
              checkTxIsConfirmed(lcd, chainId, status.txhash)
                .then((success) => {
                  // tx confirmed and successful
                  if (success.code === 0) {
                    setClaimStatus("claimed")
                  }

                  // tx confirmed but failed
                  // todo: surface exact error to user feedback
                  if (success) {
                    setIsPending(false)
                    window.clearInterval(id)
                    queryClient.invalidateQueries({
                      queryKey: ["unminted_nft"],
                    })
                  }
                })
                .catch((error) => {
                  // todo: surface error to user feedback
                  console.error("Transaction Error", error)
                })
            }, 1000)
            setIntervalId(id)
          }
        })
        .catch((error: unknown) => {
          setIsPending(false)
          console.error("error in promise", error)
        })
    }
  }

  if (claimStatus === "claimed") {
    return (
      <div className={styles.full__page}>
        <AnimatedBackground />
        <ConfettiExplosion
          force={0.85}
          duration={2500}
          particleCount={80}
          width={1200}
          height={1200}
          colors={[
            "#3AB44C",
            "#EC5B25",
            "#E9AD5F",
            "#03AEEE",
            "#06E2D2",
            "#2F3288",
            "#912A8F",
            "#D7DE26",
            "#D91F5E",
          ]}
          className={styles.confetti}
        />
        <div className={styles.modal}>
          <div className={styles.logo__wrapper}>
            <CheckIcon
              className={styles.check__icon}
              fill="var(--token-primary-500)"
            />
          </div>
          <div className={styles.text}>
            <div className={styles.text}>
              Your AllianceDAO NFT has been claimed!
            </div>
          </div>
          <div className={styles.button__wrapper}>
            <Link to="/nft-gallery" style={{ width: "100%" }}>
              <button className={styles.primary__button}>View NFT</button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.full__page}>
      <AnimatedBackground />
      <div className={styles.modal}>
        <div className={styles.logo__wrapper}>
          <Logo className={styles.logo} />
        </div>
        {!walletAddress ? (
          <div>
            <div className={styles.text}>
              <div className={styles.text}>
                Connect your wallet to see if you are eligible to claim an NFT. 
              </div>
            </div>
            <div className={styles.button__wrapper}>
              <button
                className={styles.primary__button}
                onClick={handleConnectClick}
              >
                Connect Wallet
              </button>

              <Link to="/nft-gallery" style={{ width: "100%" }}>
                <button className={styles.secondary__button}>Cancel</button>
              </Link>
            </div>
          </div>
        ) : claimAvailable ? (
          <div>
            <div className={styles.text}>
              <div className={styles.text}>
                Your NFT is waiting for you! 🎉
              </div>
            </div>
            <div className={styles.button__wrapper}>
              {!isPending ? (
                <button
                  className={styles.primary__button}
                  onClick={handleClaimClick}
                >
                  Claim NFT
                </button>
              ) : (
                <LoadingCircular />
              )}
              <Link to="/nft-gallery" style={{ width: "100%" }}>
                <button className={styles.secondary__button}>Cancel</button>
              </Link>
            </div>
          </div>
        ) : (
          <div>
            <div className={styles.text}>
              <div className={styles.text}>
              <b> This wallet is not eligible to claim an NFT.</b> 
                <br/>
                <br/>
                If you used multiple wallets during Game of Alliance, you may have to try each one. 
                <br/>
                <br/>
                Already claimed NFTs can be viewed in your gallery. 
                <br/>
                <br/>
                Follow <a href="https://twitter.com/The_AllianceDAO">@The_AllianceDAO</a> on Twitter for upcoming opportunities to own an NFT. 
                <br/>
                <br/>
              </div>
            </div>
            <div className={styles.button__wrapper}>
              <Link to="/nft-gallery" style={{ width: "100%" }}>
                <button className={styles.primary__button}>
                  View Full NFT Gallery
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
