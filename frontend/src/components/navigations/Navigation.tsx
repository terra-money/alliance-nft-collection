import { useMediaQuery } from 'usehooks-ts';
import MobileNav from './mobile/MobileNav';
import DesktopNav from './desktop/DesktopNav';

const Navigation = ({
  isMobileNavOpen,
  setMobileNavOpen,
}: {
  isMobileNavOpen: boolean,
  setMobileNavOpen: (isMobileNavOpen: boolean) => void
}) => {
  const isMobile = useMediaQuery('(max-width: 976px)');

  if (isMobile) {
    return (
      <MobileNav
        isMobileNavOpen={isMobileNavOpen}
        setMobileNavOpen={setMobileNavOpen}
      />
    )
  }

  return (
    <DesktopNav />
  );
};

export default Navigation;
