document.addEventListener("DOMContentLoaded", () => {
  const current = JSON.parse(
      localStorage.getItem("dineEasyCurrentOrder") || "null",
    ),
    enabled = localStorage.getItem("dineEasyQuickEnabled") === "true",
    quick = [
      ["Tandoori Roti", 30, "tandoori-roti.jpg"],
      ["Butter Naan", 55, "butter-naan.jpg"],
      ["Garlic Naan", 70, "garlic-naan.jpg"],
      ["Jeera Rice", 145, "jeera-rice.jpg"],
      ["Masala Chaas", 65, "masala-chaas.jpg"],
    ],
    first = current?.items?.map((x) => x.name) || [],
    allowed = quick.filter((x) => first.includes(x[0])),
    section = document.getElementById("quickOrderSection"),
    menuQuick = document.getElementById("menuQuick");
  if (section && !enabled) section.style.display = "none";
  if (menuQuick) {
    if (!enabled || !current || !allowed.length) {
      menuQuick.style.display = "none";
      return;
    }
    menuQuick.style.display = "block";
    const panel = document.getElementById("menuQuickPanel"),
      get = () => JSON.parse(localStorage.getItem("dineEasyQuickCart") || "[]"),
      save = (x) =>
        localStorage.setItem("dineEasyQuickCart", JSON.stringify(x)),
      money = (x) => "₹" + x;
    function render() {
      let cart = get(),
        total = cart.reduce((s, x) => s + x.price * x.qty, 0);
      panel.innerHTML =
        allowed
          .map((x) => {
            let item = cart.find((q) => q.name === x[0]),
              qty = item?.qty || 0;
            return `<div class="quick-menu-row"><img src="Images/menu/${x[2]}" alt=""><span>${x[0]}<br><b>${money(x[1])}</b></span><div class="quick-qty"><button data-change="${x[0]}|-1">−</button><b>${qty}</b><button data-change="${x[0]}|1">+</button></div></div>`;
          })
          .join("") +
        `<div class="quick-cart"><b>Quick Order Cart</b>${cart.length ? cart.map((x) => `<div>${x.name} × ${x.qty}<span>${money(x.price * x.qty)}</span></div>`).join("") : `<p>No additional items yet.</p>`}<strong>Total <span>${money(total)}</span></strong><button id="sendMenuQuick" ${cart.length ? "" : "disabled"}>Send to Table ${current.table}</button><small id="menuQuickMessage"></small></div>`;
      panel.querySelectorAll("[data-change]").forEach(
        (b) =>
          (b.onclick = () => {
            let [name, by] = b.dataset.change.split("|"),
              found = allowed.find((x) => x[0] === name),
              c = get(),
              item = c.find((x) => x.name === name);
            if (+by > 0) {
              item ? item.qty++ : c.push({ name, price: found[1], qty: 1 });
            } else if (item) {
              item.qty--;
              if (item.qty < 1) c = c.filter((x) => x !== item);
            }
            save(c);
            render();
          }),
      );
      let send = document.getElementById("sendMenuQuick");
      if (send)
        send.onclick = () => {
          let c = get(),
            orders = JSON.parse(localStorage.getItem("dineEasyOrders") || "[]"),
            q = {
              id: Date.now(),
              token: current.token,
              table: current.table,
              items: c,
              total: c.reduce((s, x) => s + x.price * x.qty, 0),
              status: "Preparing",
              time: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
              quick: true,
            };
          orders.unshift(q);
          localStorage.setItem("dineEasyOrders", JSON.stringify(orders));
          save([]);
          render();
          document.getElementById("menuQuickMessage").textContent =
            "Sent to your table!";
        };
    }
    document.getElementById("quickMenuToggle").onclick = () => {
      menuQuick.classList.toggle("open");
      render();
    };
    render();
  }
  if (current && document.getElementById("token"))
    setInterval(() => {
      let fresh = JSON.parse(
        localStorage.getItem("dineEasyOrders") || "[]",
      ).find((x) => x.id === current.id);
      if (fresh?.status === "Served") location.href = "Menu.html";
    }, 1000);
});
