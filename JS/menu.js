/* DineEasy menu: front-end demo data and cart interactions. Flask can later replace this data with database records. */
const dishes = [
  {
    id: 1,
    name: "Paneer Tikka",
    category: "starters",
    price: 229,
    rating: "4.8",
    description: "Chargrilled cottage cheese with fragrant Indian spices.",
    image:
      "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 2,
    name: "Butter Paneer Masala",
    category: "mains",
    price: 289,
    rating: "4.9",
    description: "Creamy tomato gravy with soft paneer cubes.",
    image:
      "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 3,
    name: "Truffle Veg Pasta",
    category: "mains",
    price: 319,
    rating: "4.7",
    description: "Penne pasta, herbs, parmesan and a truffle finish.",
    image:
      "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 4,
    name: "Crispy Corn",
    category: "starters",
    price: 179,
    rating: "4.6",
    description: "Sweet corn tossed with chilli, lime and fresh herbs.",
    image: "Images/menu/crispy-corn.png",
  },
  {
    id: 5,
    name: "Gulab Jamun",
    category: "desserts",
    price: 119,
    rating: "4.8",
    description: "Warm milk dumplings soaked in saffron sugar syrup.",
    image: "Images/menu/gulab-jamun.png",
  },
  {
    id: 6,
    name: "Fresh Lime Mojito",
    category: "drinks",
    price: 129,
    rating: "4.7",
    description: "Mint, lime and sparkling water over crushed ice.",
    image:
      "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=700&q=85",
  },
];
let cart = {},
  activeCategory = "all",
  searchTerm = "";
const el = (id) => document.getElementById(id),
  money = (n) => `₹${n.toLocaleString("en-IN")}`;
function filteredDishes() {
  return dishes.filter(
    (d) =>
      (activeCategory === "all" || d.category === activeCategory) &&
      d.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );
}
function renderMenu() {
  const items = filteredDishes();
  el("foodGrid").innerHTML = items
    .map((d) => {
      const q = cart[d.id]?.quantity || 0;
      return `<article class="food-card"><img class="food-image" src="${d.image}" alt="${d.name}"><button class="favourite" data-favourite="${d.id}" aria-label="Favourite ${d.name}"><i class="bi bi-heart"></i></button><div class="food-content"><div class="food-meta"><div><h3 class="dish-name"><span class="veg-dot"></span>${d.name}</h3><span class="rating"><i class="bi bi-star-fill"></i> ${d.rating}</span></div><strong class="price">${money(d.price)}</strong></div><p class="dish-description">${d.description}</p><div class="dish-bottom">${q ? `<div class="quantity-controls"><button data-change="${d.id}" data-delta="-1">−</button><span>${q}</span><button data-change="${d.id}" data-delta="1">+</button></div>` : `<button class="add-button" data-add="${d.id}">Add <i class="bi bi-plus-lg"></i></button>`}</div></div></article>`;
    })
    .join("");
  el("itemCount").textContent =
    `${items.length} ${items.length === 1 ? "dish" : "dishes"}`;
  el("emptyState").hidden = items.length !== 0;
}
function changeQuantity(id, delta) {
  const dish = dishes.find((d) => d.id === id);
  if (!cart[id] && delta > 0) cart[id] = { ...dish, quantity: 0 };
  if (!cart[id]) return;
  cart[id].quantity += delta;
  if (cart[id].quantity <= 0) delete cart[id];
  renderMenu();
  renderCart();
}
function renderCart() {
  const values = Object.values(cart),
    count = values.reduce((s, d) => s + d.quantity, 0),
    total = values.reduce((s, d) => s + d.quantity * d.price, 0);
  ["topCartCount", "sideCartCount"].forEach(
    (id) => (el(id).textContent = count),
  );
  el("mobileCartCount").textContent =
    `${count} ${count === 1 ? "item" : "items"}`;
  el("mobileCartTotal").textContent = money(total);
  el("cartTotal").textContent = money(total);
  el("cartEmpty").hidden = values.length > 0;
  el("cartItems").innerHTML = values
    .map(
      (d) =>
        `<div class="cart-item"><img src="${d.image}" alt="${d.name}"><div><h3>${d.name}</h3><p>${money(d.price)} each</p><div class="mini-controls"><button data-change="${d.id}" data-delta="-1">−</button><strong>${d.quantity}</strong><button data-change="${d.id}" data-delta="1">+</button></div></div><button class="remove" data-remove="${d.id}" aria-label="Remove ${d.name}"><i class="bi bi-trash3"></i></button></div>`,
    )
    .join("");
  el("checkoutBtn").disabled = !count;
}
function toggleCart(open) {
  el("cartDrawer").classList.toggle("open", open);
  el("cartBackdrop").classList.toggle("show", open);
  document.body.style.overflow = open ? "hidden" : "";
}
let toastTimer;
function toast(message) {
  el("toastMessage").querySelector("span").textContent = message;
  el("toastMessage").classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(
    () => el("toastMessage").classList.remove("show"),
    2200,
  );
}
document.addEventListener("click", (e) => {
  const add = e.target.closest("[data-add]"),
    change = e.target.closest("[data-change]"),
    remove = e.target.closest("[data-remove]"),
    fav = e.target.closest("[data-favourite]");
  if (add) {
    changeQuantity(+add.dataset.add, 1);
    toast("Added to your order");
  }
  if (change) changeQuantity(+change.dataset.change, +change.dataset.delta);
  if (remove) {
    delete cart[+remove.dataset.remove];
    renderMenu();
    renderCart();
  }
  if (fav) {
    fav.classList.toggle("active");
    fav.innerHTML = fav.classList.contains("active")
      ? '<i class="bi bi-heart-fill"></i>'
      : '<i class="bi bi-heart"></i>';
  }
});
el("searchInput").addEventListener("input", (e) => {
  searchTerm = e.target.value;
  renderMenu();
});
el("clearSearch").addEventListener("click", () => {
  el("searchInput").value = "";
  searchTerm = "";
  renderMenu();
  el("searchInput").focus();
});
el("categoryFilters").addEventListener("click", (e) => {
  const btn = e.target.closest("[data-category]");
  if (!btn) return;
  activeCategory = btn.dataset.category;
  document
    .querySelectorAll(".category")
    .forEach((b) => b.classList.toggle("active", b === btn));
  renderMenu();
});
["openCartTop", "openCartSide", "openCartMobile"].forEach((id) =>
  el(id).addEventListener("click", () => toggleCart(true)),
);
el("closeCart").addEventListener("click", () => toggleCart(false));
el("cartBackdrop").addEventListener("click", () => toggleCart(false));
el("checkoutBtn").addEventListener("click", () =>
  toast("Checkout will be connected to Flask next!"),
);
renderMenu();
renderCart();
