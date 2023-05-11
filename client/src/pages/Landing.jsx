import { Link } from "react-router-dom";
import logo from "../assets/images/logo.svg";
import main from "../assets/images/main.svg";
import LandingPage from "../assets/wrappers/LandingPage";
import { Logo } from "../components";

const Landing = () => {
  return (
    <LandingPage>
      <main>
        <nav>
          <Logo />
        </nav>
        <div className="container page">
          {/* Info */}
          <div className="info">
            <h1>
              job <span>tracking</span> app
            </h1>
            <p>
              Readymade chillwave jawn, lyft Brooklyn austin yes plz knausgaard
              fit marxism literally cold-pressed banh mi cliche. Cray
              vibecession gochujang, heirloom succulents mumblecore woke
              activated charcoal YOLO bicycle rights iceland irony.
            </p>
            <Link to="/register" className="btn btn-hero">
              Login / Register
            </Link>
          </div>
          <img src={main} alt="landing" className="img main-img" />
        </div>
      </main>
    </LandingPage>
  );
};

export default Landing;
