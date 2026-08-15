const menuData = [
  ["Paneer Tikka", "starters", 220, "paneer-tikka.jpg"],
  ["Veg Manchurian", "starters", 180, "veg-manchurian.jpg"],
  ["Paneer Chilli", "starters", 210, "paneer-chilli.jpg"],
  ["Paneer 65", "starters", 210, "paneer-65.jpg"],
  ["Hara Bhara Kebab", "starters", 190, "hara-bhara-kebab.jpg"],
  ["Tomato Soup", "starters", 110, "tomato-soup.jpg"],
  ["Sweet Corn Soup", "starters", 120, "sweet-corn-soup.jpg"],
  ["Garden Green Salad", "starters", 100, "garden-green-salad.jpg"],
  ["Paneer Butter Masala", "paneer", 240, "paneer-butter-masala.jpg"],
  ["Kadai Paneer", "paneer", 235, "kadai-paneer.jpg"],
  ["Palak Paneer", "paneer", 220, "palak-paneer.jpg"],
  ["Shahi Paneer", "paneer", 245, "shahi-paneer.jpg"],
  ["Dal Makhani", "mains", 195, "dal-makhani.jpg"],
  ["Dal Tadka", "mains", 175, "dal-tadka.jpg"],
  ["Chole Masala", "mains", 190, "chole-masala.jpg"],
  ["Veg Kolhapuri", "mains", 205, "veg-kolhapuri.jpg"],
  ["Butter Naan", "breads", 55, "butter-naan.jpg"],
  ["Garlic Naan", "breads", 70, "garlic-naan.jpg"],
  ["Tandoori Roti", "breads", 30, "tandoori-roti.jpg"],
  ["Jeera Rice", "rice", 145, "jeera-rice.jpg"],
  ["Veg Biryani", "rice", 220, "veg-biryani.jpg"],
  ["Veg Fried Rice", "rice", 185, "veg-fried-rice.jpg"],
  ["Masala Chaas", "drinks", 65, "masala-chaas.jpg"],
  ["Sweet Lassi", "drinks", 85, "sweet-lassi.jpg"],
  ["Fresh Lime Soda", "drinks", 75, "fresh-lime-soda.jpg"],
  ["Gulab Jamun", "desserts", 95, "gulab-jamun.png"],
  ["Rasmalai", "desserts", 110, "rasmalai.jpg"],
  ["Gajar Ka Halwa", "desserts", 120, "gajar-ka-halwa.jpg"],
].map((x, i) => ({
  id: i + 1,
  name: x[0],
  category: x[1],
  price: x[2],
  image: `Images/menu/${x[3]}`,
  available: true,
}));
const id = (x) => document.getElementById(x),
  read = (k, f) => JSON.parse(localStorage.getItem(k) || JSON.stringify(f)),
  write = (k, v) => localStorage.setItem(k, JSON.stringify(v)),
  menu = () => read("dineEasyMenu", menuData),
  cart = () => read("dineEasyCart", []),
  put = (v) => write("dineEasyCart", v),
  rupees = (x) => "₹" + Math.round(x).toLocaleString("en-IN"),
  table = () => localStorage.getItem("dineEasyTable") || "12";
const items = () =>
    cart()
      .map((x) => {
        let d = menu().find((q) => q.id === x.id);
        return d && { ...d, qty: x.qty };
      })
      .filter(Boolean),
  calc = (a) => {
    let s = (a || items()).reduce((n, x) => n + x.price * x.qty, 0);
    return [s, Math.round(s * 0.05), Math.round(s * 1.05)];
  };
function updateTable() {
  ["table", "tokenTable"].forEach((x) => {
    if (id(x)) id(x).textContent = table();
  });
}
function modify(n, d) {
  let c = cart(),
    x = c.find((q) => q.id === n);
  if (!x) return;
  x.qty += d;
  if (x.qty < 1) c = c.filter((q) => q.id !== n);
  put(c);
  drawCart();
}
function removeDish(n) {
  put(cart().filter((x) => x.id !== n));
  drawCart();
}
function addToCart(n) {
  let c = cart(),
    x = c.find((q) => q.id === n);
  x ? x.qty++ : c.push({ id: n, qty: 1 });
  put(c);
}
function recommendations(a) {
  let cats = a.map((x) => x.category),
    want = [];
  if (cats.includes("paneer") || cats.includes("mains"))
    want.push("breads", "rice", "starters", "desserts");
  if (cats.includes("breads")) want.push("mains", "paneer", "drinks");
  if (cats.includes("rice")) want.push("mains", "paneer", "desserts");
  return menu()
    .filter((x) => x.available && !a.some((q) => q.id === x.id))
    .map((x) => ({ x, score: want.indexOf(x.category) }))
    .filter((x) => x.score >= 0)
    .sort((a, b) => a.score - b.score || a.x.price - b.x.price)
    .slice(0, 3)
    .map((x) => x.x);
}
function drawCart() {
  let box = id("cartList");
  if (!box) return;
  let a = items(),
    t = calc(a);
  box.innerHTML = a.length
    ? a
        .map(
          (x) =>
            `<div class="cart-row"><img src="${x.image}" alt="${x.name}"><div><h4>${x.name}</h4><small>${rupees(x.price)} each</small></div><div class="qty"><button onclick="modify(${x.id},-1)">−</button><span>${x.qty}</span><button onclick="modify(${x.id},1)">+</button></div><b>${rupees(x.price * x.qty)}</b><button class="remove" onclick="removeDish(${x.id})">×</button></div>`,
        )
        .join("")
    : '<div class="empty">Your order is empty.<br><br><a class="pay-btn" href="Menu.html">Browse menu</a></div>';
  ["sub", "tax", "total"].forEach((x, i) => {
    if (id(x)) id(x).textContent = rupees(t[i]);
  });
  if (id("placeOrder")) id("placeOrder").disabled = !a.length;
  let r = id("recommendations");
  if (r)
    r.innerHTML =
      recommendations(a)
        .map(
          (x) =>
            `<article class="rec"><img src="${x.image}" alt="${x.name}"><div><b>${x.name}</b><span>${rupees(x.price)}</span><button onclick="addToCart(${x.id});drawCart()">+ Add</button></div></article>`,
        )
        .join("") ||
      '<p class="muted">Add dishes to see tailored recommendations.</p>';
}
function placeOrder() {
  let a = items();
  if (!a.length) return;
  let orders = read("dineEasyOrders", []),
    order = {
      id: Date.now(),
      token:
        "A-" +
        String(orders.filter((x) => !x.quick).length + 1).padStart(2, "0"),
      table: table(),
      items: a,
      total: calc(a)[2],
      status: "Preparing",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      quick: false,
    };
  orders.unshift(order);
  write("dineEasyOrders", orders);
  write("dineEasyCurrentOrder", order);
  put([]);
  location.href = "Token.html";
}
function initToken() {
  let o = read("dineEasyCurrentOrder", null);
  if (!id("token")) return;
  if (!o) {
    location.href = "Menu.html";
    return;
  }
  id("token").textContent = "#" + o.token;
  id("orderTime").textContent = o.time;
  id("receivedTime").textContent = "Received at " + o.time;
  let fast = menu().filter((x) =>
    [
      "Tandoori Roti",
      "Butter Naan",
      "Garlic Naan",
      "Jeera Rice",
      "Masala Chaas",
    ].includes(x.name),
  );
  id("quickItems").innerHTML = fast
    .map(
      (x) =>
        `<button class="quick-item" data-id="${x.id}"><span>${x.name}</span><b>${rupees(x.price)}</b></button>`,
    )
    .join("");
  id("quickToggle").onclick = () => id("quickPanel").classList.toggle("hidden");
  id("quickItems").onclick = (e) => {
    let b = e.target.closest(".quick-item");
    if (b) b.classList.toggle("selected");
  };
  id("sendQuick").onclick = () => {
    let selected = [...document.querySelectorAll(".quick-item.selected")].map(
      (x) => menu().find((d) => d.id === +x.dataset.id),
    );
    if (!selected.length) {
      id("quickConfirmation").textContent = "Please select at least one item.";
      return;
    }
    let orders = read("dineEasyOrders", []),
      q = {
        id: Date.now(),
        token: o.token,
        table: o.table,
        items: selected.map((x) => ({ ...x, qty: 1 })),
        total: selected.reduce((n, x) => n + x.price, 0),
        status: "Preparing",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        quick: true,
      };
    orders.unshift(q);
    write("dineEasyOrders", orders);
    document
      .querySelectorAll(".quick-item.selected")
      .forEach((x) => x.classList.remove("selected"));
    id("quickConfirmation").textContent =
      "Quick order placed successfully! Your additional items have been sent to the kitchen.";
  };
}
function admin() {
  let app = id("adminApp");
  if (!app) return;
  app.innerHTML = `<div class="admin-shell"><aside class="admin-side"><b>DineEasy</b><small>RESTAURANT ADMIN</small><nav><button data-v="dashboard">Dashboard</button><button data-v="menu">Menu management</button><button data-v="orders">Orders</button><button data-v="tables">Tables</button><button data-v="quick">Quick orders</button></nav><a href="Menu.html">View customer menu →</a></aside><main class="admin-main" id="adminContent"></main></div>`;
  let content = id("adminContent"),
    orders = () => read("dineEasyOrders", []),
    list = (arr, quick = false) =>
      arr.length
        ? `<div class="admin-list">${arr.map((o) => `<article><div><b>${quick ? "<i>QUICK ORDER</i> " : ""}${o.token} · Table ${o.table}</b><small>${o.items.map((x) => x.name + " × " + x.qty).join(", ")} · ${o.time}</small></div><select data-status="${o.id}"><option ${o.status === "Preparing" ? "selected" : ""}>Preparing</option><option ${o.status === "Ready" ? "selected" : ""}>Ready</option><option ${o.status === "Served" ? "selected" : ""}>Served</option></select></article>`).join("")}</div>`
        : '<p class="muted">No orders yet.</p>';
  function render(v) {
    let all = orders(),
      normal = all.filter((x) => !x.quick),
      quick = all.filter((x) => x.quick);
    if (v === "dashboard")
      content.innerHTML = `<p class="eyebrow">TODAY AT DINEEASY</p><h1>Restaurant dashboard</h1><div class="stats"><div><small>Today’s orders</small><b>${normal.length}</b></div><div><small>Pending orders</small><b>${all.filter((x) => x.status !== "Served").length}</b></div><div><small>Quick orders</small><b>${quick.length}</b></div><div><small>Order total</small><b>${rupees(normal.reduce((s, x) => s + x.total, 0))}</b></div></div><h2>Recent orders</h2>${list(all.slice(0, 5))}`;
    else if (v === "orders")
      content.innerHTML = `<p class="eyebrow">NORMAL ORDERS</p><h1>Orders</h1>${list(normal)}`;
    else if (v === "quick")
      content.innerHTML = `<p class="eyebrow">PRIORITY ADDITIONS</p><h1>Quick orders</h1>${list(quick, true)}`;
    else if (v === "tables")
      content.innerHTML = `<p class="eyebrow">DINE-IN FLOOR</p><h1>Tables</h1><div class="tables">${Array.from(
        { length: 12 },
        (_, i) => {
          let n = String(i + 1),
            o = all.find((x) => x.table === n && x.status !== "Served");
          return `<div class="table-tile ${o ? "occupied" : ""}"><b>Table ${n}</b><small>${o ? "Occupied · " + o.token : "Available"}</small></div>`;
        },
      ).join("")}</div>`;
    else
      content.innerHTML = `<div class="admin-heading"><div><p class="eyebrow">MENU MANAGEMENT</p><h1>Menu items</h1></div><button id="newDish" class="mini-button">Add item</button></div><div class="admin-list">${menu()
        .map(
          (x) =>
            `<article><div><b>${x.name}</b><small>${x.category} · ${rupees(x.price)}</small></div><label><input data-avail="${x.id}" type="checkbox" ${x.available ? "checked" : ""}> Available</label><button class="mini-button" data-edit="${x.id}">Edit</button><button class="mini-button" data-delete="${x.id}">Delete</button></article>`,
        )
        .join("")}</div>`;
    content.querySelectorAll("[data-status]").forEach(
      (s) =>
        (s.onchange = () => {
          let a = orders(),
            o = a.find((x) => x.id === +s.dataset.status);
          o.status = s.value;
          write("dineEasyOrders", a);
          render(v);
        }),
    );
    content.querySelectorAll("[data-avail]").forEach(
      (x) =>
        (x.onchange = () => {
          let m = menu(),
            d = m.find((q) => q.id === +x.dataset.avail);
          d.available = x.checked;
          write("dineEasyMenu", m);
        }),
    );
    content.querySelectorAll("[data-delete]").forEach(
      (x) =>
        (x.onclick = () => {
          write(
            "dineEasyMenu",
            menu().filter((q) => q.id !== +x.dataset.delete),
          );
          render("menu");
        }),
    );
    content.querySelectorAll("[data-edit]").forEach(
      (x) =>
        (x.onclick = () => {
          let d = menu().find((q) => q.id === +x.dataset.edit),
            n = prompt("New price", d.price);
          if (n && +n > 0) {
            d.price = +n;
            write("dineEasyMenu", menu());
            render("menu");
          }
        }),
    );
    if (id("newDish"))
      id("newDish").onclick = () => {
        let n = prompt("Dish name"),
          p = +prompt("Price");
        if (n && p > 0) {
          let m = menu();
          m.push({
            id: Date.now(),
            name: n,
            category: "starters",
            price: p,
            image: "Images/menu/paneer-tikka.jpg",
            available: true,
          });
          write("dineEasyMenu", m);
          render("menu");
        }
      };
  }
  app
    .querySelectorAll("[data-v]")
    .forEach((x) => (x.onclick = () => render(x.dataset.v)));
  render("dashboard");
}
document.addEventListener("DOMContentLoaded", () => {
  updateTable();
  drawCart();
  if (id("placeOrder")) id("placeOrder").onclick = placeOrder;
  initToken();
  admin();
});
document.addEventListener("DOMContentLoaded", () => {
  let finish = id("finishOrder");
  if (!finish) return;
  finish.onclick = () => {
    let o = read("dineEasyCurrentOrder", null);
    if (!o) return;
    o.billRequested = true;
    o.status = "Bill requested";
    write("dineEasyCurrentOrder", o);
    let orders = read("dineEasyOrders", []),
      saved = orders.find((x) => x.id === o.id);
    if (saved) {
      saved.billRequested = true;
      saved.status = "Bill requested";
      write("dineEasyOrders", orders);
    }
    id("finishMessage").textContent =
      "Done! The restaurant has been notified that your bill is requested.";
    finish.disabled = true;
    finish.textContent = "Bill requested ✓";
  };
});
