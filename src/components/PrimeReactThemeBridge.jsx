"use client";
import { useEffect } from "react";

const LIGHT = "/primereact/themes/lara-light-blue.css";
const DARK  = "/primereact/themes/lara-dark-blue.css";

export default function PrimeReactThemeBridge() {
  useEffect(() => {
    const LINK_ID = "pr-theme-link";

    const ensureLink = () => {
      let el = document.getElementById(LINK_ID) ;
      if (!el) {
        el = document.createElement("link");
        el.id = LINK_ID;
        el.rel = "stylesheet";
        document.head.appendChild(el);
      }
      return el;
    };

    const applyTheme = () => {
      const isDark = document.documentElement.classList.contains("dark");
      const link = ensureLink();
      link.href = isDark ? DARK : LIGHT;
    };

    // initial
    applyTheme();

    // react to Flowbite toggling class="dark" on <html>
    const obs = new MutationObserver(applyTheme);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    return () => obs.disconnect();
  }, []);

  return null;
}
