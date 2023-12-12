import { ReactComponent as TwitterIcon } from "assets/socials/Twitter.svg"
import { ReactComponent as MediumIcon } from "assets/socials/Medium.svg"
import { ReactComponent as TelegramIcon } from "assets/socials/Telegram.svg"
import styles from "./socials.module.scss"

export const Socials = ({ size, gap, iconColor }: { size?: number, gap?: number, iconColor?: string }) => {
  const socialSize = size || 16
  const displayGap = gap || 12
  const displayIconColor = iconColor || "var(--token-dark-500)"

  return (
    <div className={styles.socials} style={{ gap: `${displayGap}px` }}>
      <a
        href="https://twitter.com/The_AllianceDAO"
        target="_blank"
        rel="noopener noreferrer"
      >
        <TwitterIcon
          fill={displayIconColor}
          width={socialSize}
          height={socialSize}
        />
      </a>
      <a
        href="https://medium.com/terra-money/introducing-alliancedao-84ab93501f3c"
        target="_blank"
        rel="noopener noreferrer"
      >
        <MediumIcon
          fill={displayIconColor}
          width={socialSize + 1}
          height={socialSize + 1}
        />
      </a>
      <a
        href="https://t.me/The_AllianceDAO"
        target="_blank"
        rel="noopener noreferrer"
      >
        <TelegramIcon
          fill={displayIconColor}
          width={socialSize - 2}
          height={socialSize - 2}
        />
      </a>
    </div>
  );
};