import { createRoot } from "react-dom/client";
import Hamburger from "./components/Hamburger";
import SiteLogo from "./components/SiteLogo";

// hydrate islands
document.querySelectorAll<HTMLElement>("[data-react]").forEach((el) => {
  const comp = el.dataset.react;
  if (comp === "hamburger") {
    createRoot(el).render(
      <Hamburger target={el.dataset.target || "#mobile-menu"} className={el.dataset.class} />,
    );
  } else if (comp === "sitelogo") {
    createRoot(el).render(<SiteLogo />);
  }
});
