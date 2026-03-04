"use client";

import { useEffect } from "react";

type BrowserName = "edge" | "chrome" | "firefox" | "safari" | "unknown";

function detectBrowser(): BrowserName {
  const ua = navigator.userAgent;
  // Edge must come before Chrome (Edge includes "Chrome" in UA)
  if (/Edg\//.test(ua)) return "edge";
  if (/Chrome\//.test(ua)) return "chrome";
  if (/Firefox\//.test(ua)) return "firefox";
  if (/Safari\//.test(ua) && /Version\//.test(ua)) return "safari";
  return "unknown";
}

function applyBrowserFixes(browser: BrowserName) {
  const html = document.documentElement;

  // Tag the <html> element so CSS can target browser-specific issues
  html.setAttribute("data-browser", browser);

  // ── Safari fixes ────────────────────────────────────────────────────────────
  if (browser === "safari") {
    // Fix 1: Safari calculates 100vh including the address bar, causing
    // content to be hidden. We set a --vh custom property and update it on
    // resize so layouts can use calc(var(--vh) * 100) instead of 100vh.
    const setVh = () => {
      html.style.setProperty("--vh", `${window.innerHeight * 0.01}px`);
    };
    setVh();
    window.addEventListener("resize", setVh);

    // Fix 2: Safari doesn't support CSS scroll-behavior natively in older
    // versions — ensure smooth scrolling via JS for anchor links.
    document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", (e) => {
        const id = anchor.getAttribute("href")?.slice(1);
        const target = id ? document.getElementById(id) : null;
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: "smooth" });
        }
      });
    });

    // Fix 3: Safari < 15 has gaps with flex gap — add a fallback class
    // so global CSS can target it if needed.
    const safariVersion = parseInt(
      (navigator.userAgent.match(/Version\/(\d+)/) ?? [])[1] ?? "99",
      10
    );
    if (safariVersion < 15) {
      html.classList.add("safari-legacy");
    }
  }

  // ── Firefox fixes ───────────────────────────────────────────────────────────
  if (browser === "firefox") {
    // Firefox scroll snap can behave slightly differently — tag for CSS
    html.classList.add("browser-firefox");
  }

  // ── Chrome / Edge ── (Chromium) ─────────────────────────────────────────────
  if (browser === "chrome" || browser === "edge") {
    html.classList.add("browser-chromium");
  }

  // ── Unknown / unsupported browser ──────────────────────────────────────────
  if (browser === "unknown") {
    const banner = document.createElement("div");
    banner.id = "browser-warning";
    banner.style.cssText =
      "position:fixed;top:0;left:0;right:0;z-index:99999;background:#8B5E3C;color:#fff;text-align:center;padding:10px 16px;font-size:14px;font-family:sans-serif;";
    banner.textContent =
      "Your browser may not be fully supported. For the best experience, please use Chrome, Edge, Firefox, or Safari.";
    const close = document.createElement("button");
    close.textContent = "✕";
    close.style.cssText = "margin-left:12px;background:none;border:none;color:#fff;cursor:pointer;font-size:16px;";
    close.onclick = () => banner.remove();
    banner.appendChild(close);
    document.body.prepend(banner);
  }
}

export default function BrowserCompat() {
  useEffect(() => {
    const browser = detectBrowser();
    applyBrowserFixes(browser);

    if (process.env.NODE_ENV === "development") {
      console.info(`[BrowserCompat] Detected browser: ${browser}`);
    }
  }, []);

  return null;
}
