import classNames from 'classnames/bind';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ReactComponent as Logo } from 'assets/AllianceDAOLogo.svg';
import { ReactComponent as CheckIcon } from 'assets/check.svg';
import { useNav } from '../../../config/routes';
import styles from './DesktopNav.module.scss';

const cx = classNames.bind(styles);

const DesktopNav = () => {
  const { pathname } = useLocation();
  const { menu } = useNav();

  return (
    <nav className={styles.navigation}>
      <a href='/'>
        <Logo className={styles.logo} />
      </a>
      <ul className={styles.link__container}>
        {menu.map(({ path, name, isExternal }) => {
          if (isExternal) {
            return (
              <li key={path}>
                <a href={path} target="_blank" rel="noopener noreferrer">{name}</a>
              </li>
            )
          }
          return (
            <li key={path} className={cx({ [styles.active]: pathname === path })}>
              <NavLink to={path}>
                {name}
              </NavLink>
            </li>
          )
        })}
      </ul>
      <Link to="/connect-wallet">
        <button className={styles.nav__button}>
          <CheckIcon />
          Connect Wallet
        </button>
      </Link>
    </nav>
  );
};

export default DesktopNav;
