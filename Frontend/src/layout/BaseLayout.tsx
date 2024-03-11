import { Outlet } from "react-router-dom";
import Sidebar from "../components/Dashboard/admin/sidebar/Sidebar";
import MoonIcon from "../assets/icons/moon.svg";
import SunIcon from "../assets/icons/sun.svg";
import { ThemeContext } from "../context/ThemeContext";
import { useContext, useEffect } from "react";
import { DARK_THEME, LIGHT_THEME } from "../constants/themeConstants";
import "../styles/Sidebar.scss";
import "../styles/AreaTob.scss";
import "../styles/App.scss";

const BaseLayout = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  console.log(theme);

  useEffect(() => {
    if (theme === DARK_THEME) {
      document.body.classList.add("dark-mode");
      console.log("dark mode");
    } else {
      document.body.classList.remove("dark-mode");
      console.log("light mode");
    }
    console.log(theme);
  }, [theme]);
  return (
    <main className="page-wrapper">
      {/* left of page */}
      <Sidebar />
      {/* right side/content of the page */}
      <div className="content-wrapper">
        <Outlet />
      </div>

      <button type="button" className="theme-toggle-btn" onClick={toggleTheme}>
        <img
          src={theme === LIGHT_THEME ? SunIcon : MoonIcon}
          alt=""
          className="theme-icon"
        />
      </button>
    </main>
  );
};

export default BaseLayout;
