import { useAppContext } from "../context/appContext";
import NavLinks from "./NavLinks";
import Logo from "./Logo";
import Wrapper from "../assets/wrappers/BigSidebar";

const BigSidebar = () => {
  const { showSidebar } = useAppContext();
  return (
    <Wrapper>
      <div
        className={
          // We want to render the sidebar in the beginning until clicked off --> Displayed by default
          showSidebar ? "sidebar-container" : "sidebar-container show-sidebar"
        }
      >
        <div className="content">
          {/* Our Jobify Logo */}
          <header>
            <Logo />
          </header>
          {/* Our Links */}
          <NavLinks  />
        </div>
      </div>
    </Wrapper>
  );
};

export default BigSidebar;
