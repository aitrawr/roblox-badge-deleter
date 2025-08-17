(() => {
  let uid = ""; // Your Roblox user ID
  let wl = [];  // badges ID you want to keep and whitelist ["123456", "789012"]

  let stop = false;
  let dDelay = 1200;
  let cToken = null;

  const slp = ms => new Promise(r => setTimeout(r, ms));

  // Panic button (press "p" to stop)
  document.addEventListener("keydown", e => {
    if (e.key === "p") {
      stop = true;
      console.log("Stopping...");
    }
  });

  async function setTk() {
    let r = await fetch("https://badges.roblox.com/v1/user/badges/0", {
      method: "DELETE",
      headers: { "x-csrf-token": "" },
      credentials: "include"
    });
    cToken = r.headers.get("x-csrf-token");
    if (cToken) console.log("Token refreshed");
    else console.error("Could not get CSRF token. Make sure you’re logged in.");
  }

  async function gBadges(u) {
    let b = [], np = "";
    do {
      let r = await fetch(`https://badges.roblox.com/v1/users/${u}/badges?limit=10&sortOrder=Desc${np ? `&cursor=${np}` : ''}`, {
        method: "GET",
        headers: { "accept": "application/json" },
        credentials: "include"
      });
      if (!r.ok) return [];
      let d = await r.json();
      b.push(...d.data);
      np = d.nextPageCursor;
    } while (np);
    console.log(`Fetched ${b.length} badges.`);
    return b;
  }

  async function delBd(bid) {
    let r = await fetch(`https://badges.roblox.com/v1/user/badges/${bid}`, {
      method: "DELETE",
      headers: { "x-csrf-token": cToken },
      credentials: "include"
    });

    if (r.status === 403) {
      console.warn("403 → refreshing token...");
      await setTk();
      return delBd(bid);
    }
    if (r.status === 429) {
      console.warn("Rate limit → increasing delay");
      dDelay *= 2;
      await slp(dDelay);
      return false;
    }
    if (!r.ok) return false;
    return true;
  }

  async function delAll(u) {
    await setTk();
    if (!cToken) return;

    let badges = await gBadges(u);
    console.log("Starting deletions...");

    let deleted = 0;
    for (let bd of badges) {
      if (stop) break;
      if (wl.includes(bd.id.toString())) {
        console.log(`Skipped ${bd.id} (${bd.name})`);
        continue;
      }
      let ok = await delBd(bd.id);
      if (ok) {
        console.log(`Deleted ${bd.id} (${bd.name})`);
        deleted++;
        await slp(dDelay);
        if (deleted % 20 === 0) {
          console.log("Cooling down 20s...");
          await slp(20000);
        }
      }
    }
    console.log("Done.");
  }

  const res = prompt("Delete all badges except whitelist? Type 'Yes, I understand' to confirm.");
  if (res && res.toLowerCase() === "yes, i understand") {
    delAll(uid);
  } else {
    console.log("Cancelled.");
  }
})();
