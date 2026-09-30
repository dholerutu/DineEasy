const dishes = [
  [
    "Paneer Tikka",
    "starters",
    220,
    "Chargrilled cottage cheese with fragrant Indian spices.",
    "paneer tikka",
  ],
  [
    "Veg Manchurian",
    "starters",
    180,
    "Crisp vegetable dumplings in tangy Indo-Chinese sauce.",
    "veg manchurian",
  ],
  [
    "Paneer Chilli",
    "starters",
    210,
    "Golden paneer, bell peppers and a lively chilli sauce.",
    "paneer chilli",
  ],
  [
    "Paneer 65",
    "starters",
    210,
    "Spiced crisp paneer bites with curry leaves.",
    "paneer 65",
  ],
  [
    "Hara Bhara Kebab",
    "starters",
    190,
    "Spinach and pea kebabs with mint chutney.",
    "hara bhara kebab",
  ],
  [
    "Tomato Soup",
    "starters",
    110,
    "Smooth warm tomato soup with gentle herbs.",
    "tomato soup",
  ],
  [
    "Sweet Corn Soup",
    "starters",
    120,
    "Comforting vegetable broth with sweet corn.",
    "sweet corn soup",
  ],
  [
    "Garden Green Salad",
    "starters",
    100,
    "Seasonal greens, cucumber, tomato and lemon.",
    "garden green salad",
  ],
  [
    "Paneer Butter Masala",
    "paneer",
    240,
    "Soft paneer in a velvety tomato butter gravy.",
    "paneer butter masala",
  ],
  [
    "Kadai Paneer",
    "paneer",
    235,
    "Paneer and peppers in a fragrant kadai masala.",
    "kadai paneer",
  ],
  [
    "Palak Paneer",
    "paneer",
    220,
    "Paneer cubes in a smooth spinach gravy.",
    "palak paneer",
  ],
  [
    "Shahi Paneer",
    "paneer",
    245,
    "Luxurious paneer curry with nuts and cream.",
    "shahi paneer",
  ],
  [
    "Dal Makhani",
    "mains",
    195,
    "Slow-cooked black lentils, butter and cream.",
    "dal makhani",
  ],
  [
    "Dal Tadka",
    "mains",
    175,
    "Yellow lentils with a sizzling garlic tempering.",
    "dal tadka",
  ],
  [
    "Chole Masala",
    "mains",
    190,
    "Punjabi chickpeas in a rich onion-tomato gravy.",
    "chole masala",
  ],
  [
    "Veg Kolhapuri",
    "mains",
    205,
    "Mixed vegetables in bold, spicy Kolhapuri gravy.",
    "veg kolhapuri",
  ],
  [
    "Butter Naan",
    "breads",
    55,
    "Pillowy tandoor-baked flatbread brushed with butter.",
    "butter naan",
  ],
  [
    "Garlic Naan",
    "breads",
    70,
    "Soft naan topped with garlic and coriander.",
    "garlic naan",
  ],
  [
    "Tandoori Roti",
    "breads",
    30,
    "Whole-wheat flatbread baked in the tandoor.",
    "tandoori roti",
  ],
  [
    "Jeera Rice",
    "rice",
    145,
    "Fragrant basmati rice tempered with cumin.",
    "jeera rice",
  ],
  [
    "Veg Biryani",
    "rice",
    220,
    "Aromatic rice layered with garden vegetables.",
    "veg biryani",
  ],
  [
    "Veg Fried Rice",
    "rice",
    185,
    "Wok-tossed rice with fresh vegetables.",
    "veg fried rice",
  ],
  [
    "Masala Chaas",
    "drinks",
    65,
    "Chilled yogurt drink with roasted cumin and mint.",
    "masala chaas",
  ],
  [
    "Sweet Lassi",
    "drinks",
    85,
    "Traditional creamy, chilled sweet lassi.",
    "sweet lassi",
  ],
  ["Fresh Lime Soda", "drinks", 75, "Sparkling lime refreshment.", "fresh lime soda"],
  ["Mineral Water", "drinks", 30, "Chilled sealed mineral water bottle.", "mineral-water.jpeg"],
  [
    "Gulab Jamun",
    "desserts",
    95,
    "Warm milk dumplings in saffron-cardamom syrup.",
    "gulab jamun",
  ],
  [
    "Rasmalai",
    "desserts",
    110,
    "Cottage-cheese patties in chilled saffron milk.",
    "rasmalai",
  ],
  [
    "Gajar Ka Halwa",
    "desserts",
    120,
    "Slow-cooked carrot pudding with nuts.",
    "gajar ka halwa",
  ],
].map((d, i) => ({
  id: i + 1,
  name: d[0],
  category: d[1],
  price: d[2],
  description: d[3],
  image: `Images/menu/${d[4].includes(".") ? d[4] : d[4].toLowerCase().replace(/\s+/g, "-") + ".jpg"}`,
}));
const $ = (id) => document.getElementById(id),
  money = (n) => "₹" + Math.round(n).toLocaleString("en-IN"),
  getCart = () => JSON.parse(localStorage.getItem("dineEasyCart") || "[]"),
  save = (c) => {
    localStorage.setItem("dineEasyCart", JSON.stringify(c));
    updateCount();
  },
  table = () => localStorage.getItem("dineEasyTable") || "12";
let active = "all",
  chosen;
function cartItems() {
  return getCart()
    .map((x) => ({ ...dishes.find((d) => d.id === x.id), qty: x.qty }))
    .filter((x) => x.id);
}
function add(id) {
  let c = getCart(),
    x = c.find((x) => x.id === id);
  x ? x.qty++ : c.push({ id, qty: 1 });
  save(c);
}
function updateCount() {
  let n = getCart().reduce((s, x) => s + x.qty, 0);
  ["sideCartCount", "topCartCount"].forEach((id) => {
    let e = $(id);
    if (e) e.textContent = n;
  });
  let t = $("tableNo");
  if (t) t.textContent = table();
}
function renderMenu() {
  let grid = $("foodGrid");
  if (!grid) return;
  let q = $("searchInput").value.toLowerCase(),
    items = dishes.filter(
      (d) =>
        (active === "all" || d.category === active) &&
        (d.name + " " + d.description).toLowerCase().includes(q),
    );
  $("categoryTitle").textContent =
    active === "all"
      ? "Explore our menu"
      : active[0].toUpperCase() + active.slice(1);
  $("itemCount").textContent = `${items.length} dishes`;
  grid.innerHTML =
    items
      .map((d) => {
        let qty = getCart().find((x) => x.id === d.id)?.qty || 0;
        return `<article class="food-card"><img class="food-image" src="${d.image}" alt="${d.name}" onclick="showDish(${d.id})"><div class="food-content"><div class="food-meta"><div><h3 class="dish-name" onclick="showDish(${d.id})"><span class="veg-dot">●</span> ${d.name}</h3><span class="rating"><i class="bi bi-star-fill"></i> 4.8</span></div><strong class="price">${money(d.price)}</strong></div><p class="dish-description">${d.description}</p><div class="dish-bottom">${qty ? `<div class="quantity-controls"><button onclick="change(${d.id},-1)">−</button><span>${qty}</span><button onclick="change(${d.id},1)">+</button></div>` : `<button class="add-button" onclick="addAndRender(${d.id})">Add <i class="bi bi-plus-lg"></i></button>`}</div></div></article>`;
      })
      .join("") ||
    '<p class="empty-state">No dishes found. Try another search.</p>';
}
function addAndRender(id) {
  add(id);
  renderMenu();
}
function change(id, by) {
  let c = getCart(),
    x = c.find((x) => x.id === id);
  if (!x) return;
  x.qty += by;
  if (x.qty < 1) c = c.filter((i) => i.id !== id);
  save(c);
  renderMenu();
}
function showDish(id) {
  chosen = dishes.find((d) => d.id === id);
  $("modalImage").src = chosen.image;
  $("modalImage").alt = chosen.name;
  $("modalTitle").textContent = chosen.name;
  $("modalDescription").textContent = chosen.description;
  $("modalPrice").textContent = money(chosen.price);
  new bootstrap.Modal("#dishModal").show();
}
document.addEventListener("DOMContentLoaded", () => {
  updateCount();
  let categories = [
      ["all", "All"],
      ["starters", "Starters"],
      ["paneer", "Paneer"],
      ["mains", "Main Course"],
      ["breads", "Breads"],
      ["rice", "Rice"],
      ["drinks", "Beverages"],
      ["desserts", "Desserts"],
    ],
    box = $("categoryFilters");
  if (box) {
    box.innerHTML = categories
      .map(
        (x, i) =>
          `<button class="category ${i ? "" : "active"}" data-c="${x[0]}">${x[1]}</button>`,
      )
      .join("");
    box.onclick = (e) => {
      let b = e.target.closest("button");
      if (!b) return;
      active = b.dataset.c;
      box
        .querySelectorAll("button")
        .forEach((x) => x.classList.toggle("active", x === b));
      renderMenu();
    };
    $("searchInput").oninput = renderMenu;
    $("modalAdd").onclick = () => {
      add(chosen.id);
      renderMenu();
      bootstrap.Modal.getInstance($("dishModal")).hide();
    };
    renderMenu();
  }
});
document.addEventListener("DOMContentLoaded", () => {
  let panel = $("menuQuickPanel"),
    shell = $("menuQuick");
  if (!panel) return;
  let quick = dishes.filter((x) =>
    [
      "Butter Naan",
      "Garlic Naan",
      "Tandoori Roti",
      "Jeera Rice",
      "Masala Chaas",
      "Mineral Water",
    ].includes(x.name),
  );
  function drawQuick() {
    let q = JSON.parse(localStorage.getItem("dineEasyQuickCart") || "[]"),
      sum = q.reduce((s, x) => s + x.qty, 0);
    panel.innerHTML =
      quick
        .map(
          (x) =>
            `<div class="quick-menu-row"><img src="${x.image}" alt=""><span>${x.name}<br><b>${money(x.price)}</b></span><button data-q="${x.id}">+</button></div>`,
        )
        .join("") +
      `<div class="quick-cart"><b>Quick Order Cart (${sum})</b><button id="openQuick">View quick cart</button></div>`;
    panel.querySelectorAll("[data-q]").forEach(
      (b) =>
        (b.onclick = () => {
          let q = JSON.parse(localStorage.getItem("dineEasyQuickCart") || "[]"),
            x = q.find((a) => a.id === +b.dataset.q);
          x ? x.qty++ : q.push({ id: +b.dataset.q, qty: 1 });
          localStorage.setItem("dineEasyQuickCart", JSON.stringify(q));
          drawQuick();
        }),
    );
    $("openQuick").onclick = () => (location.href = "Token.html");
  }
  $("quickMenuToggle").onclick = () => {
    shell.classList.toggle("open");
    drawQuick();
  };
});
