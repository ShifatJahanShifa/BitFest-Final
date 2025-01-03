import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top when the page changes
  }, [location]);

  return null; // No UI rendered for this component
};

export default ScrollToTop;
