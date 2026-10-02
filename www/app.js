(() => {
  const $ = (id) => document.getElementById(id);
  const USERS_KEY = "drm_users", SESSION_KEY = "drm_session";
  const rupee = (n) => "₹" + n.toLocaleString("en-IN");

  // ---------- storage helpers (safe) ----------
  const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
  const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };

  // ---------- views ----------
  const views = ["login", "home", "bracelet", "vastu", "wishlist", "pay", "orders"];
  const TAB_OF = { pay: "wishlist" };
  function show(name) {
    views.forEach((v) => ($("view-" + v).hidden = v !== name));
    $("topbar").hidden = name === "login";
    $("tabbar").hidden = name === "login";
    document.querySelectorAll("#tabbar button").forEach((b) => b.classList.toggle("active", b.dataset.tab === (TAB_OF[name] || name)));
    if (name === "wishlist") renderWishlist();
    if (name === "orders") renderOrders();
    if (name === "pay") renderPay();
    window.scrollTo(0, 0);
  }
  document.addEventListener("click", (e) => {
    const go = e.target.closest("[data-go]");
    if (go) show(go.dataset.go);
  });
  $("homeBtn").onclick = () => show("home");

  // ---------- auth ----------
  let signup = false;
  function setMode(s) {
    signup = s;
    $("tabLogin").classList.toggle("active", !s);
    $("tabSignup").classList.toggle("active", s);
    $("nameRow").hidden = !s;
    $("loginSubmit").textContent = s ? "Create account & enter" : "Enter the Mandir";
    $("fPass").autocomplete = s ? "new-password" : "current-password";
    $("loginErr").textContent = "";
  }
  $("tabLogin").onclick = () => setMode(false);
  $("tabSignup").onclick = () => setMode(true);

  async function hash(text) {
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
    return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
  }

  $("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = $("fEmail").value.trim().toLowerCase();
    const pass = $("fPass").value;
    const users = load(USERS_KEY, {});
    const h = await hash(email + "|" + pass);
    if (signup) {
      if (users[email]) return ($("loginErr").textContent = "That email already has an account — please log in.");
      users[email] = { name: $("fName").value.trim() || email.split("@")[0], h };
      save(USERS_KEY, users);
    } else if (!users[email] || users[email].h !== h) {
      return ($("loginErr").textContent = "Email or password is incorrect. New here? Create an account.");
    }
    save(SESSION_KEY, email);
    me = email;
    enter(users[email].name);
  });

  function enter(name) {
    $("hello").textContent = name;
    $("homeName").textContent = name;
    $("loginForm").reset();
    show("home");
  }
  $("logoutBtn").onclick = () => { me = null; try { localStorage.removeItem(SESSION_KEY); } catch {} setMode(false); show("login"); };

  // ---------- Know Your Bracelet ----------
  const WEEKDAY = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];
  const NUMBER_PLANET = { 1: "Sun", 2: "Moon", 3: "Jupiter", 4: "Rahu", 5: "Mercury", 6: "Venus", 7: "Ketu", 8: "Saturn", 9: "Mars" };
  const CHALDEAN = ["Saturn", "Jupiter", "Mars", "Sun", "Venus", "Mercury", "Moon"]; // planetary-hour (hora) order
  const reduce = (n) => { while (n > 9) n = String(n).split("").reduce((a, d) => a + +d, 0); return n; };

  function analyse(dobStr, timeStr) {
    const [y, m, d] = dobStr.split("-").map(Number);
    const hour = +timeStr.split(":")[0];
    const wd = new Date(y, m - 1, d).getDay();
    const weekdayLord = WEEKDAY[wd];
    const moolank = reduce(d);
    const bhagyank = reduce(dobStr.replace(/-/g, "").split("").reduce((a, c) => a + +c, 0));
    // hora ruler: sequence starts with the weekday lord at ~6:00 sunrise (approximation)
    const sinceSunrise = (hour - 6 + 24) % 24;
    const hora = CHALDEAN[(CHALDEAN.indexOf(weekdayLord) + sinceSunrise) % 7];

    const sources = [
      { planet: NUMBER_PLANET[moolank], w: 3, why: `Birth number ${moolank} (day ${d}) is ruled by ${NUMBER_PLANET[moolank]}` },
      { planet: NUMBER_PLANET[bhagyank], w: 3, why: `Destiny number ${bhagyank} (full date) is ruled by ${NUMBER_PLANET[bhagyank]}` },
      { planet: weekdayLord, w: 2, why: `You were born on a ${["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][wd]}, ruled by ${weekdayLord}` },
      { planet: hora, w: 2, why: `Your birth hour falls under the planetary hour of ${hora}` },
    ];
    const score = {}, reasons = {};
    sources.forEach((s) => {
      score[s.planet] = (score[s.planet] || 0) + s.w;
      (reasons[s.planet] = reasons[s.planet] || []).push(s.why);
    });
    const ranked = Object.keys(score).sort((a, b) => score[b] - score[a]);
    const picks = ranked.map((p) => ({
      emoji: PLANETS[p].emoji, color: PLANETS[p].color, planet: p, ...BRACELETS[p],
      why: reasons[p].join(". ") + `. Strengthens ${PLANETS[p].trait}.`,
    }));
    // top up to exactly 5 with temple specials, then remaining planets
    SPECIAL_BRACELETS.forEach((s) => picks.length < 5 && picks.push({ ...s, color: "#8a6d4b" }));
    Object.keys(BRACELETS).forEach((p) => {
      if (picks.length < 5 && !score[p])
        picks.push({ emoji: PLANETS[p].emoji, color: PLANETS[p].color, planet: p, ...BRACELETS[p], why: `A balancing choice that supports ${PLANETS[p].trait}.` });
    });
    return { picks: picks.slice(0, 5), moolank, bhagyank, weekdayLord, hora };
  }

  const dobEl = $("dob");
  dobEl.max = new Date().toISOString().slice(0, 10);

  $("braceForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const r = analyse(dobEl.value, $("tob").value);
    const card = (p, i) => `
      <article class="prod ${i < 2 ? "best" : ""}">
        ${i < 2 ? '<span class="badge">★ Best match</span>' : '<span class="badge soft">Supportive</span>'}
        <div class="thumb" style="background:linear-gradient(135deg,${p.color}33,${p.color}88)">${p.emoji}</div>
        <div class="pbody">
          <h4>${p.name}</h4>
          <p><b>Stone:</b> ${p.stone}</p>
          <p>${p.why}</p>
          <div class="price">${rupee(p.price)}</div>
          ${actions(p)}
        </div>
      </article>`;
    $("braceResult").innerHTML = `
      <div class="summary">
        <b>Your chart snapshot</b>
        <div class="pills">
          <span class="pill">Birth number ${r.moolank} · ${NUMBER_PLANET[r.moolank]}</span>
          <span class="pill">Destiny number ${r.bhagyank} · ${NUMBER_PLANET[r.bhagyank]}</span>
          <span class="pill">Weekday lord · ${r.weekdayLord}</span>
          <span class="pill">Birth hour lord · ${r.hora}</span>
        </div>
      </div>
      <h3 class="sect">Your 5 bracelets</h3>
      <div class="results">${r.picks.map(card).join("")}</div>
      <p class="fine">Based on numerology, weekday and planetary-hour (hora, assuming 6 AM sunrise). For a full birth-chart reading, consult an astrologer.</p>`;
    $("braceResult").scrollIntoView({ behavior: "smooth" });
  });

  // ---------- Vastu Fix ----------
  const picked = { problem: new Set(), enhance: new Set() };
  function chips(el, list, kind) {
    el.innerHTML = list.map((t) => `<button type="button" class="chip ${kind}" data-id="${t.id}">${t.emoji} ${t.label}</button>`).join("");
    el.onclick = (e) => {
      const b = e.target.closest(".chip");
      if (!b) return;
      const s = picked[kind];
      s.has(b.dataset.id) ? s.delete(b.dataset.id) : s.add(b.dataset.id);
      b.classList.toggle("on");
      $("vastuErr").textContent = "";
    };
  }
  chips($("problemChips"), PROBLEM_TAGS, "problem");
  chips($("enhanceChips"), ENHANCE_TAGS, "enhance");
  $("roomSel").innerHTML = ROOMS.map((r) => `<option>${r}</option>`).join("");

  const tagLabel = (id) => [...PROBLEM_TAGS, ...ENHANCE_TAGS].find((t) => t.id === id)?.label ?? id;

  $("vastuForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const chosen = new Set([...picked.problem, ...picked.enhance]);
    if (!chosen.size) return ($("vastuErr").textContent = "Please choose at least one problem tag or enhance tag.");
    const room = $("roomSel").value;

    const scored = VASTU_PRODUCTS.map((p) => {
      const hits = p.tags.filter((t) => chosen.has(t));
      const score = hits.length * 3 + (p.rooms.includes(room) && room !== ROOMS[0] ? 2 : 0) + (p.rooms.includes(ROOMS[0]) ? 0.5 : 0);
      return { ...p, hits, score };
    }).sort((a, b) => b.score - a.score || a.price - b.price);

    // 5–7 products: all genuine matches up to 7, topped up to 5 with the best remaining
    const matches = scored.filter((p) => p.hits.length);
    const out = matches.length >= 5 ? matches.slice(0, 7) : [...matches, ...scored.filter((p) => !p.hits.length)].slice(0, 5);

    $("vastuResult").innerHTML = `
      <div class="summary"><b>${out.length} remedies</b> for
        <div class="pills">${[...chosen].map((t) => `<span class="pill">${tagLabel(t)}</span>`).join("")}${room !== ROOMS[0] ? `<span class="pill">📍 ${room}</span>` : ""}</div></div>
      <div class="results">${out.map((p, i) => `
        <article class="prod ${i === 0 ? "best" : ""}">
          ${i === 0 ? '<span class="badge">★ Top pick</span>' : ""}
          <div class="thumb" style="background:linear-gradient(135deg,#e8912d33,#6b1d1d55)">${p.emoji}</div>
          <div class="pbody">
            <h4>${p.name}</h4>
            <p>${p.hits.length ? "Helps with: " + p.hits.map(tagLabel).join(", ") : "General harmonising remedy for your space."}</p>
            <p><b>Place:</b> ${p.place}</p>
            <div class="price">${rupee(p.price)}</div>
            ${actions(p)}
          </div>
        </article>`).join("")}</div>`;
    $("vastuResult").scrollIntoView({ behavior: "smooth" });
  });

  // ---------- wishlist, checkout, orders ----------
  let me = null;                       // signed-in email
  const cache = {};                    // name -> {name, price, emoji}
  const DKEY = () => "drm_data_" + me;
  const data = () => load(DKEY(), { wishlist: [], orders: [] });
  const saveData = (d) => save(DKEY(), d);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const enc = encodeURIComponent;

  function actions(p) {
    cache[p.name] = { name: p.name, price: p.price, emoji: p.emoji };
    const on = data().wishlist.some((w) => w.name === p.name);
    return `<div class="acts">
      <button class="btn-sm ${on ? "saved" : ""}" data-wish="${enc(p.name)}">${on ? "♥ Saved" : "♡ Wishlist"}</button>
      <button class="btn-sm solid" data-buy="${enc(p.name)}">Buy now</button></div>`;
  }
  function toast(msg) {
    const t = document.createElement("div");
    t.className = "toast"; t.textContent = msg;
    document.body.appendChild(t); setTimeout(() => t.remove(), 2200);
  }

  let checkout = [];                   // items being paid for
  document.addEventListener("click", (e) => {
    const w = e.target.closest("[data-wish]"), b = e.target.closest("[data-buy]");
    const rm = e.target.closest("[data-rm]"), co = e.target.closest("#checkoutAll"), wb = e.target.closest("[data-wbuy]");
    if (w) {
      const name = decodeURIComponent(w.dataset.wish), d = data();
      const idx = d.wishlist.findIndex((x) => x.name === name);
      if (idx >= 0) { d.wishlist.splice(idx, 1); w.textContent = "♡ Wishlist"; w.classList.remove("saved"); toast("Removed from wishlist"); }
      else { d.wishlist.push(cache[name]); w.textContent = "♥ Saved"; w.classList.add("saved"); toast("🪷 Added to wishlist"); }
      saveData(d);
    }
    if (b) { checkout = [cache[decodeURIComponent(b.dataset.buy)]]; show("pay"); }
    if (rm) { const d = data(); d.wishlist = d.wishlist.filter((x) => x.name !== decodeURIComponent(rm.dataset.rm)); saveData(d); renderWishlist(); }
    if (co) { checkout = data().wishlist.slice(); show("pay"); }
    if (wb) { checkout = [data().wishlist.find((x) => x.name === decodeURIComponent(wb.dataset.wbuy))]; show("pay"); }
  });

  function renderWishlist() {
    const list = data().wishlist;
    $("wishList").innerHTML = list.length ? list.map((p) => `
      <article class="prod"><div class="thumb" style="background:#f6e8c4">${p.emoji}</div>
        <div class="pbody"><h4>${esc(p.name)}</h4><div class="price">${rupee(p.price)}</div>
          <div class="acts"><button class="btn-sm solid" data-wbuy="${enc(p.name)}">Buy now</button>
          <button class="btn-sm" data-rm="${enc(p.name)}">Remove</button></div></div></article>`).join("")
      : `<div class="empty">♡<br>Your wishlist is empty.<br><small>Tap “♡ Wishlist” on any bracelet or Vastu remedy to save it here.</small></div>`;
    $("checkoutAll").hidden = list.length < 2;
    $("checkoutAll").textContent = `Checkout all (${list.length}) · ${rupee(list.reduce((s, p) => s + p.price, 0))}`;
  }

  // payment page (demo only — no real payment is taken)
  const shipFee = (t) => (t >= 999 ? 0 : 79);
  function renderPay() {
    const total = checkout.reduce((s, p) => s + p.price, 0), ship = shipFee(total);
    $("paySummary").innerHTML = checkout.map((p) => `<div class="line"><span>${p.emoji} ${esc(p.name)}</span><b>${rupee(p.price)}</b></div>`).join("") +
      `<div class="line"><span>Delivery</span><b>${ship ? rupee(ship) : "Free"}</b></div>
       <div class="line tot"><span>Total</span><b>${rupee(total + ship)}</b></div>`;
    $("payAmt").textContent = rupee(total + ship);
    $("payErr").textContent = "";
  }
  document.querySelectorAll('input[name="pm"]').forEach((r) => r.addEventListener("change", () => {
    $("upiRow").hidden = document.querySelector('input[name="pm"]:checked').value !== "upi";
  }));

  $("payForm").addEventListener("submit", (e) => {
    e.preventDefault();
    if (!checkout.length) return show("wishlist");
    const method = document.querySelector('input[name="pm"]:checked').value;
    if (method === "upi" && !/^[\w.\-]{2,}@[\w]{2,}$/.test($("upiId").value.trim()))
      return ($("payErr").textContent = "Enter a valid UPI ID, e.g. name@upi");
    const total = checkout.reduce((s, p) => s + p.price, 0);
    const d = data();
    d.orders.unshift({
      id: "DRM" + Date.now().toString().slice(-7), date: new Date().toISOString(),
      items: checkout, total: total + shipFee(total),
      method: { upi: "UPI", card: "Card / Netbanking", cod: "Cash on delivery" }[method],
      status: method === "cod" ? "Confirmed · Pay on delivery" : "Paid",
      to: { name: $("shipName").value.trim(), addr: $("shipAddr").value.trim() },
    });
    d.wishlist = d.wishlist.filter((w) => !checkout.some((c) => c.name === w.name));
    saveData(d); checkout = [];
    $("payForm").reset(); $("upiRow").hidden = false;
    toast("🙏 Order placed!"); show("orders");
  });

  function renderOrders() {
    const o = data().orders;
    $("orderList").innerHTML = o.length ? o.map((x) => `
      <article class="card order">
        <div class="ohead"><b>#${x.id}</b><span class="stat">${esc(x.status)}</span></div>
        <small>${new Date(x.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })} · ${esc(x.method)}</small>
        ${x.items.map((p) => `<div class="line"><span>${p.emoji} ${esc(p.name)}</span><b>${rupee(p.price)}</b></div>`).join("")}
        <div class="line tot"><span>Total</span><b>${rupee(x.total)}</b></div>
        <small>Deliver to ${esc(x.to.name)}, ${esc(x.to.addr)}</small>
      </article>`).join("")
      : `<div class="empty">🛍️<br>No purchases yet.<br><small>Your orders will appear here.</small></div>`;
  }

  // ---------- boot ----------
  const email = load(SESSION_KEY, null), users = load(USERS_KEY, {});
  if (email && users[email]) { me = email; enter(users[email].name); } else show("login");
})();
