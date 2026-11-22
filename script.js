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

updateCountdown();
setInterval(updateCountdown, 1000);
