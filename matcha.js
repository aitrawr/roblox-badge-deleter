let uid = "YOUR ROBLOX ID", cToken, wl = [""]; // put badge id u dont want to delete separate using a comma just dont use a comma when its the last one
let stop = false, dDelay = 800;

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  document.addEventListener("keydown", e => e.key === "p" && (stop = true, console.log("Stopping badge deletion...")));
}

let slp = ms => new Promise(r => setTimeout(r, ms)), 
    setTk = async () => { 
      let r = await fetch("https://auth.roblox.com/v1/logout", { method: 'POST', headers: { 'accept': 'application/json' }, credentials: 'include' }); 
      if (r.status === 200 || r.status === 403) { 
        cToken = r.headers.get("x-csrf-token"); 
        if (!cToken) {
          console.error("CSRF token not found. Make sure you are logged in.");
        }
      } else {
        console.error("Failed to set token, status code:", r.status);
        if (r.status === 401) {
          console.error("Authentication failed. Please ensure you are logged in to Roblox.");
        }
      }
    }, 
    gBadges = async u => { 
      let b = [], np = ""; 
      console.log("Fetching badges..."); 
      do { 
        let r = await fetch(`https://badges.roblox.com/v1/users/${u}/badges?limit=10&sortOrder=Desc${np ? `&cursor=${np}` : ''}`, { method: 'GET', headers: { 'accept': 'application/json' } }); 
        if (!r.ok) return void console.error(`Failed to fetch badges, status code: ${r.status}`); 
        let d = await r.json(); 
        d.data && Array.isArray(d.data) && b.push(...d.data); 
        np = d.nextPageCursor; 
        console.log(`Fetched ${b.length} badges so far...`);
      } while (np); 
      console.log(`Fetched ${b.length} badges in total.`); 
      return b; 
    },
    estimateTime = (numBadges) => {
      const timePerBadge = dDelay / 1000; 
      const totalTime = numBadges * timePerBadge; 
      const minutes = Math.floor(totalTime / 60);
      const seconds = Math.round(totalTime % 60);
      console.log(`Estimated time to delete all badges: ${minutes} minutes and ${seconds} seconds.`);
    },
    delBd = async bid => { 
      try { 
        let r = await fetch(`https://badges.roblox.com/v1/user/badges/${bid}`, { method: 'DELETE', headers: { 'accept': 'application/json', 'x-csrf-token': cToken }, credentials: 'include' }); 
        if (r.status === 429) return console.warn("Too Many Requests detected! doubling the delay. (if you still get 429 stop the program. wait a minute and run it with increased delay.)"), dDelay *= 2, await slp(dDelay), false; 
        if (!r.ok) return console.error(`Failed to delete badge ${bid}, status code: ${r.status}`), false; 
        return true; 
      } catch (e) { 
        return console.error(`Error occurred while deleting badge ${bid}:`, e), false; 
      } 
    }, 
    delAll = async u => { 
      await setTk(); 
      if (!cToken) {
        console.error("Cannot proceed to delete badges. CSRF token is not set.");
        return;
      }
      let b = await gBadges(u); 
      estimateTime(b.length); 
      console.log("Deleting badges..."); 
      for (let bd of b) { 
        if (stop) { console.log("Deletion process stopped by panic button!"); break; } 
        if (wl.includes(bd.id)) { console.log(`Skipped badge ${bd.id} - ${bd.name} (whitelisted)`); continue; } 
        let s = await delBd(bd.id); 
        s ? (console.log(`Deleted badge ${bd.id} - ${bd.name}`), await slp(dDelay)) : console.warn(`Retrying failed deletion for badge ${bd.id} later.`); 
      } 
      console.log("Badge deletion process finished."); 
    }; 

delAll(uid);
