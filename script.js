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

updateCountdown();
setInterval(updateCountdown, 1000);
