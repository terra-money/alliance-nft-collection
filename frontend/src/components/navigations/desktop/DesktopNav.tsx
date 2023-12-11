import classNames from "classnames/bind";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ReactComponent as Logo } from "assets/AllianceDAOLogo.svg";
import { ReactComponent as ExternalLinkIcon } from "assets/ExternalLink.svg";
import { ReactComponent as CheckIcon } from "assets/check.svg";
import { ReactComponent as TwitterIcon } from "assets/socials/Twitter.svg";
import { ReactComponent as MediumIcon } from "assets/socials/Medium.svg";
import { ReactComponent as TelegramIcon } from "assets/socials/Telegram.svg";
import { useNav } from "../../../config/routes";
import styles from "./DesktopNav.module.scss";

const cx = classNames.bind(styles);

const DesktopNav = () => {
  const socialSize = 16;
  const { pathname } = useLocation();
  const { menu } = useNav();

  return (
    <nav className={styles.navigation}>
      <a href="/nft-gallery">
        <Logo className={styles.logo} />
      </a>
      <ul className={styles.link__container}>
        {menu.map(({ path, name, isExternal }) => {
          if (isExternal) {
            return (
              <li key={path}>
                <a href={path} target="_blank" rel="noopener noreferrer">
                  {name}
                  <ExternalLinkIcon />
                </a>
              </li>
            )
          }
          return (
            <li
              key={path}
              className={cx({ [styles.active]: pathname === path })}
            >
              <NavLink to={path}>{name}</NavLink>
            </li>
          )
        })}
      </ul>
      <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
        <div className={styles.socials}>
          <a
            href="https://twitter.com/AllianceDAO"
            target="_blank"
            rel="noopener noreferrer"
          >
            <TwitterIcon
              fill="var(--token-dark-500)"
              width={socialSize}
              height={socialSize}
            />
          </a>
          <a
            href="https://discord.gg/5QrSjPzY"
            target="_blank"
            rel="noopener noreferrer"
          >
            <MediumIcon
              fill="var(--token-dark-500)"
              width={socialSize + 1}
              height={socialSize + 1}
            />
          </a>
          <a
            href="https://t.me/alliancedao"
            target="_blank"
            rel="noopener noreferrer"
          >
            <TelegramIcon
              fill="var(--token-dark-500)"
              width={socialSize - 2}
              height={socialSize - 2}
            />
          </a>
        </div>
        <Link to="/">
          <button className={styles.nav__button}>
            <CheckIcon />
            Connect Wallet
          </button>
        </Link>
      </div>
    </nav>
  );
};

export default DesktopNav;
