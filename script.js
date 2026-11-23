// Edit these values when the wedding details are final.
const wedding = {
  siteName: "Swarohi",
  bride: "Swathi",
  groom: "Rohithashva",
  isoDate: "2027-05-09",
  displayDate: "09 May 2027",
  venue: "Sangama, Belthangady",
  address: "",
  time: ""
};

const pad = (number, digits = 2) => String(number).padStart(digits, "0");
const setText = (id, value) => {
  const element = document.getElementById(id);
  if (element && value) element.textContent = value;
};

function initHeroDotGrid() {
  const canvas = document.querySelector(".hero-dot-grid");
  const hero = document.getElementById("home");
  const context = canvas?.getContext("2d");
  if (!canvas || !hero || !context) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const dots = [];
  const ripples = [];
  const pointer = { x: -1000, y: -1000, previousX: -1000, previousY: -1000, speed: 0, lastMovedAt: 0, active: false };
  const startedAt = performance.now();
  let nextCenterRippleAt = startedAt + 5200;
  let width = 0;
  let height = 0;
  let animationFrame;
  let isVisible = true;

  function addCenterRipple(now) {
    ripples.push({ x: width / 2, y: height / 2, startedAt: now, duration: 1900, radius: 440 });
  }

  function resize() {
    const rect = hero.getBoundingClientRect();
    const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
    width = rect.width;
    height = rect.height;
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    dots.length = 0;
    const spacing = width < 600 ? 28 : 35;
    for (let row = 0, y = spacing / 2; y < height; row += 1, y += spacing) {
      for (let col = 0, x = spacing / 2; x < width; col += 1, x += spacing) {
        const duration = 9000 + Math.random() * 3000;
        const phaseJitter = (Math.random() - 0.5) * 0.16;
        dots.push({
          x,
          y,
          // A staggered diagonal phase makes the shimmer travel across the grid.
          phase: (((col * 300 - row * 110 + phaseJitter * 1000) / duration) % 1 + 1) % 1,
          duration,
          glitterPhase: Math.random() * Math.PI * 2,
          glitterSpeed: 0.00035 + Math.random() * 0.00065,
          offsetX: 0,
          offsetY: 0,
          velocityX: 0,
          velocityY: 0
        });
      }
    }
    draw(performance.now());
  }

  function draw(now) {
    context.clearRect(0, 0, width, height);
    const elapsed = now - startedAt;
    pointer.speed *= 0.86;

    if (!reducedMotion && now >= nextCenterRippleAt) {
      addCenterRipple(now);
      nextCenterRippleAt = now + 7500 + Math.random() * 5500;
    }

    // Ripples travel through the grid by briefly pushing dots outward.
    for (let i = ripples.length - 1; i >= 0; i -= 1) {
      const ripple = ripples[i];
      if (now - ripple.startedAt >= ripple.duration) ripples.splice(i, 1);
    }

    for (const dot of dots) {
      let targetX = 0;
      let targetY = 0;
      let rippleStrength = 0;
      if (!reducedMotion) {
        for (const ripple of ripples) {
          const age = (now - ripple.startedAt) / ripple.duration;
          const dx = dot.x - ripple.x;
          const dy = dot.y - ripple.y;
          const distance = Math.hypot(dx, dy);
          const front = age * ripple.radius;
          const band = Math.exp(-(((distance - front) / 26) ** 2)) * (1 - age);
          if (distance > 0 && band > 0.005) {
            const push = band * (ripple.radius > 400 ? 22 : 19);
            targetX += (dx / distance) * push;
            targetY += (dy / distance) * push;
            rippleStrength = Math.max(rippleStrength, band);
          }
        }
      }
      dot.velocityX = (dot.velocityX + (targetX - dot.offsetX) * 0.065) * 0.84;
      dot.velocityY = (dot.velocityY + (targetY - dot.offsetY) * 0.065) * 0.84;
      dot.offsetX += dot.velocityX;
      dot.offsetY += dot.velocityY;

      const waveProgress = reducedMotion ? 0 : (elapsed / dot.duration + dot.phase) % 1;
      const wave = reducedMotion ? 0 : Math.pow(Math.max(0, 1 - Math.abs(waveProgress - 0.5) / 0.16), 2);
      const glitter = reducedMotion ? 0 : Math.max(0, Math.sin(now * dot.glitterSpeed + dot.glitterPhase)) ** 18;
      const distance = Math.hypot(dot.x + dot.offsetX - pointer.x, dot.y + dot.offsetY - pointer.y);
      const motionFade = Math.max(0, 1 - (now - pointer.lastMovedAt) / 180);
      const motionGlow = hasFinePointer && pointer.active ? Math.min(pointer.speed / 8, 1) * motionFade : 0;
      const glow = motionGlow * Math.max(0, 1 - distance / 235);
      const opacity = 0.16 + wave * 0.3 + glitter * 0.15 + glow * 0.27 + rippleStrength * 0.38;
      context.beginPath();
      context.arc(dot.x + dot.offsetX, dot.y + dot.offsetY, 0.9 + wave * 0.55 + glitter * 0.3 + glow * 0.45 + rippleStrength * 0.6, 0, Math.PI * 2);
      context.fillStyle = `rgba(255, ${glow > 0.12 || wave > 0.45 || rippleStrength > 0.2 ? 218 : 239}, ${glow > 0.12 || wave > 0.45 || rippleStrength > 0.2 ? 126 : 205}, ${opacity})`;
      context.fill();
    }

    if (!reducedMotion && isVisible) animationFrame = requestAnimationFrame(draw);
  }

  if (hasFinePointer) {
    hero.addEventListener("pointermove", (event) => {
      const rect = canvas.getBoundingClientRect();
      pointer.previousX = pointer.x;
      pointer.previousY = pointer.y;
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
      pointer.speed = Math.hypot(pointer.x - pointer.previousX, pointer.y - pointer.previousY);
      pointer.lastMovedAt = performance.now();
      pointer.active = true;
    });
    hero.addEventListener("pointerleave", () => { pointer.active = false; });

    const orbitCircles = hero.querySelectorAll(".orbit-star, .orbit-flame, .orbit-core");
    orbitCircles.forEach((circle) => {
      circle.addEventListener("pointerenter", () => {
        const circleRect = circle.getBoundingClientRect();
        const canvasRect = canvas.getBoundingClientRect();
        ripples.push({
          x: circleRect.left + circleRect.width / 2 - canvasRect.left,
          y: circleRect.top + circleRect.height / 2 - canvasRect.top,
          startedAt: performance.now(),
          duration: 1500,
          radius: 330
        });
      });
    });
  }

  window.addEventListener("resize", resize, { passive: true });
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible && !reducedMotion && !animationFrame) animationFrame = requestAnimationFrame(draw);
      if (!isVisible && animationFrame) {
        cancelAnimationFrame(animationFrame);
        animationFrame = undefined;
      }
    }).observe(hero);
  }
  resize();
}

function updateCountdown() {
  const distance = new Date(`${wedding.isoDate}T00:00:00+05:30`).getTime() - Date.now();
  const values = distance <= 0
    ? [0, 0, 0, 0]
    : [
        Math.floor(distance / 86400000),
        Math.floor((distance % 86400000) / 3600000),
        Math.floor((distance % 3600000) / 60000),
        Math.floor((distance % 60000) / 1000)
      ];

  ["days", "hours", "minutes", "seconds"].forEach((id, index) => {
    setText(id, pad(values[index], index === 0 ? 3 : 2));
  });
}

const styledBrand = `${wedding.siteName}<span class="dot turmeric"></span><span class="dot kumkum"></span>`;
document.title = `${wedding.siteName} \u2665 ${wedding.displayDate}`;
document.getElementById("site-name").innerHTML = styledBrand;
document.getElementById("footer-brand").innerHTML = styledBrand;
setText("card-couple", `${wedding.bride} ♥ ${wedding.groom}`);
setText("hero-date", `Sunday · ${wedding.displayDate}`);
setText("event-date", `Sunday, ${wedding.displayDate}`);
setText("footer-date", wedding.isoDate.split("-").reverse().join("."));
setText("card-date", wedding.isoDate.split("-").reverse().join(" · "));
setText("venue-name", wedding.venue);
setText("venue-address", wedding.address);
setText("event-time", wedding.time);

// The time is still to be announced, so calendar entries are all-day events.
const saveDateModal = document.getElementById("save-date-modal");
const calendarButton = saveDateModal.querySelector(".save-date-calendar");
const closeModalButton = saveDateModal.querySelector(".save-date-close");
const laterButton = saveDateModal.querySelector(".save-date-later");
setText("modal-event-date", `Sunday, ${wedding.displayDate}`);
setText("modal-venue", wedding.venue);

function closeSaveDateModal() {
  saveDateModal.hidden = true;
  sessionStorage.setItem("std_popup_closed", "true");
}

function escapeCalendarText(value) {
  return value.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
}

function saveWeddingToCalendar() {
  const [year, month, day] = wedding.isoDate.split("-");
  const nextDay = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day) + 1));
  const endDate = `${nextDay.getUTCFullYear()}${pad(nextDay.getUTCMonth() + 1)}${pad(nextDay.getUTCDate())}`;
  const startDate = `${year}${month}${day}`;
  const eventTitle = `${wedding.bride} & ${wedding.groom}'s Wedding`;
  const description = "We can't wait to celebrate with you!";
  const location = [wedding.venue, wedding.address].filter(Boolean).join(", ");
  const isAppleDevice = /iPad|iPhone|iPod|Macintosh/.test(navigator.userAgent)
    || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

  if (isAppleDevice) {
    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Swarohi//Save The Date//EN",
      "CALSCALE:GREGORIAN",
      "BEGIN:VEVENT",
      "UID:swarohi-20270509@example.com",
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "")}`,
      `DTSTART;VALUE=DATE:${startDate}`,
      `DTEND;VALUE=DATE:${endDate}`,
      `SUMMARY:${escapeCalendarText(eventTitle)}`,
      `LOCATION:${escapeCalendarText(location)}`,
      `DESCRIPTION:${escapeCalendarText(description)}`,
      "URL:https://swarohi.in",
      "END:VEVENT",
      "END:VCALENDAR"
    ].join("\r\n");
    const url = URL.createObjectURL(new Blob([icsContent], { type: "text/calendar;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "swarohi-save-the-date.ics";
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  } else {
    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: eventTitle,
      dates: `${startDate}/${endDate}`,
      details: description,
      location,
      "sprop": "website:https://swarohi.in"
    });
    window.open(`https://calendar.google.com/calendar/render?${params}`, "_blank", "noopener,noreferrer");
  }

  closeSaveDateModal();
}

closeModalButton.addEventListener("click", closeSaveDateModal);
laterButton.addEventListener("click", closeSaveDateModal);
calendarButton.addEventListener("click", saveWeddingToCalendar);
saveDateModal.addEventListener("click", (event) => {
  if (event.target === saveDateModal) closeSaveDateModal();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !saveDateModal.hidden) closeSaveDateModal();
});
if (sessionStorage.getItem("std_popup_closed") !== "true") saveDateModal.hidden = false;

initHeroDotGrid();
updateCountdown();
setInterval(updateCountdown, 1000);
