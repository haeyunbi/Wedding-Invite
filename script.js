
document.addEventListener("DOMContentLoaded", () => {
  const cover = document.getElementById("cover");
  const invitation = document.getElementById("invitation");
  const openButton = document.getElementById("openInvitation");

  const music = document.getElementById("weddingMusic");
  const musicButton = document.getElementById("musicButton");
  const musicLabel = document.getElementById("musicLabel");

  const rsvpButton = document.getElementById("rsvpButton");
  const rsvpNote = document.getElementById("rsvpNote");

  // Replace this with your published Google Forms responder link.
  const RSVP_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSfEjHyvWWjMg5_W_o7Xc5kEf_53csx0Rg9Ij_MTjsCOsc301g/viewform?usp=dialog";

  // Open the invitation and attempt to play music.
  openButton.addEventListener("click", async () => {
    cover.classList.add("hidden");
    invitation.classList.remove("hidden");

    window.scrollTo({ top: 0, behavior: "smooth" });

    try {
      await music.play();
      updateMusicButton(true);
    } catch (error) {
      updateMusicButton(false);
      console.warn("Muzik belum dapat dimainkan:", error);
    }
  });

  function updateMusicButton(isPlaying) {
    musicLabel.textContent = isPlaying
      ? "Pause Muzik"
      : "Mainkan Muzik";

    musicButton.setAttribute(
      "aria-pressed",
      String(isPlaying)
    );
  }

  musicButton.addEventListener("click", async () => {
    if (music.paused) {
      try {
        await music.play();
        updateMusicButton(true);
      } catch (error) {
        updateMusicButton(false);
        alert(
          "Muzik tidak dapat dimainkan. " +
          "Sila pastikan fail assets/music.mp3 tersedia."
        );
      }
    } else {
      music.pause();
      updateMusicButton(false);
    }
  });

  music.addEventListener("ended", () => {
    updateMusicButton(false);
  });

  // Open the online RSVP form.
  rsvpButton.addEventListener("click", () => {
    if (RSVP_FORM_URL === "GOOGLE_FORM_URL_HERE") {
      alert(
        "Borang RSVP belum tersedia buat masa ini. " +
        "Sila cuba lagi selepas pautan borang dikemas kini. ♡"
      );
      return;
    }

    try {
      const formURL = new URL(RSVP_FORM_URL);

      if (formURL.protocol !== "https:") {
        throw new Error("Pautan mestilah menggunakan HTTPS.");
      }

      window.open(
        formURL.href,
        "_blank",
        "noopener,noreferrer"
      );
    } catch (error) {
      alert("Pautan RSVP tidak sah. Sila semak script.js.");
      console.error(error);
    }
  });

  // Keep the RSVP note accurate until a form is connected.
  if (RSVP_FORM_URL !== "GOOGLE_FORM_URL_HERE") {
    rsvpNote.textContent =
      "Sila tekan butang di atas untuk mengesahkan kehadiran.";
  }
});

/* ==================================
   WEDDING WEBSITE ANIMATIONS
   ================================== */

// 1. Reveal elements as guests scroll
const weddingRevealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        weddingRevealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.12,
    rootMargin: "0px 0px -35px 0px"
  }
);

document.querySelectorAll(".reveal").forEach((element) => {
  weddingRevealObserver.observe(element);
});

// 2. Create gentle floating pink petals
const reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

if (!reduceMotion) {
  const petalContainer = document.createElement("div");
  petalContainer.className = "floating-petals";
  petalContainer.setAttribute("aria-hidden", "true");
  document.body.appendChild(petalContainer);

  const petalColors = [
    "#f3b8c6",
    "#f7d5dc",
    "#e9a9b9",
    "#fbe5e9"
  ];

  // Keep the number low for smooth loading
  for (let i = 0; i < 12; i++) {
    const petal = document.createElement("span");

    petal.style.setProperty(
      "--left",
      `${Math.random() * 100}%`
    );

    petal.style.setProperty(
      "--size",
      `${8 + Math.random() * 9}px`
    );

    petal.style.setProperty(
      "--duration",
      `${12 + Math.random() * 12}s`
    );

    petal.style.setProperty(
      "--delay",
      `${-Math.random() * 20}s`
    );

    petal.style.setProperty(
      "--petal-color",
      petalColors[
        Math.floor(Math.random() * petalColors.length)
      ]
    );

    petalContainer.appendChild(petal);
  }
}

// 3. Subtle background parallax
let weddingParallaxTicking = false;

function updateWeddingParallax() {
  if (reduceMotion) return;

  if (!weddingParallaxTicking) {
    window.requestAnimationFrame(() => {
      const offset = window.scrollY * 0.12;

      document.body.style.setProperty(
        "--bg-scroll",
        `${offset}px`
      );

      weddingParallaxTicking = false;
    });

    weddingParallaxTicking = true;
  }
}
updateWeddingParallax();
