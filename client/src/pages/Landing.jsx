import { Link, Navigate } from "react-router-dom";
import main from "../assets/images/main.svg";
import LandingPage from "../assets/wrappers/LandingPage";
import { Logo } from "../components";
import { useAppContext } from "../context/appContext";

const Landing = () => {
  const { user } = useAppContext();
  return (
    <>
    {/* If there is a user logged in and they try to access the landing page --> Kicks them to the dashboard */}
      {user && <Navigate to="/" />}
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
                Readymade chillwave jawn, lyft Brooklyn austin yes plz
                knausgaard fit marxism literally cold-pressed banh mi cliche.
                Cray vibecession gochujang, heirloom succulents mumblecore woke
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
    </>
  );
};

export default Landing;
