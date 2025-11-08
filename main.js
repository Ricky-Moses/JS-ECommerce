// Header Element
const headerEl = document.querySelector("header");
// Main Element
const mainEl = document.querySelector("main");
// Aside(Cart Page)
const cartPage = document.querySelector("aside#cart");

// It'll Hold our fetched Data from fetching process
let products = {};

// Cart storage
let cart = JSON.parse(localStorage.getItem("Cart")) || [];

// is User logged
let isUserLogged = JSON.parse(localStorage.getItem("UserData")) || {};

// Fetch a data from data.json (Top level block)
async function fetchData() {
  try {
    const res = await fetch("./asset/data.json", import.meta.url);
    const data = await res.json();
    products = data;
    renderKeyValues(products); // Drop down function
    const firstProduct = Object.keys(products)[0]; // Initially render first product data from JSON.
    renderProducts(products[firstProduct]); // Product data will render
  } catch (err) {
    console.error(err);
  }
}

fetchData();
// End of fetch block

// Header Responsive function
headerEl.querySelector("#toggleHeader").addEventListener("click", () => {
  const isExpended =
    headerEl.style.height === "" || headerEl.style.height === "68px";

  Object.assign(headerEl.style, {
    height: isExpended ? "200px" : "68px",
    transition: "height .5s ease",
  });
});

// Main section page contains (HOME, SHOP, PROFILE)
const pageEl = mainEl.querySelectorAll("section");

// The pages need to show function
function showPages(pageId = "home") {
  pageEl.forEach((pages) => {
    pages.style.display = pages.id === pageId ? "flex" : "none";
  });
}

showPages("home"); // Initially call the function show HOME Page.

// Home page
const homePage = mainEl.querySelector("#home");
// Shop page
const shopPage = mainEl.querySelector("#shop");
// Profile page
const profilePage = mainEl.querySelector("#profile");

// Navigate to HOME function
headerEl.querySelector("#navigateToHome").addEventListener("click", () => {
  showPages("home");
});

// Navigate to SHOP & PROFILE function
headerEl.querySelectorAll("nav ul li").forEach((li) => {
  li.addEventListener("click", () => {
    const pageId = li.dataset.page;

    // Click and call the function
    showPages(pageId);
  });
});

// Home page
function homePageFunc(user) {
  const loggedUser = homePage.querySelector("#loggedUserName");
  if (user) {
    loggedUser.textContent =
      user.name.charAt(0).toUpperCase() + user.name.slice(1);
  }
}

homePageFunc(isUserLogged);
// Open Cart button
const isOpenCart = headerEl.querySelector("#openCart");
const isCloseCart = cartPage.querySelector("#closeCart");

function toggleCart(isOpen) {
  cartPage.classList.toggle("right-0", isOpen);
  cartPage.classList.toggle("-right-[200%]", !isOpen);
  /*
    Click -> isOpenCart return true in toggle [right-0], but in [-right-1/2] return false because of NOT Operator.

    Click -> isCloseCart return true in toggle [-right-1/2], because of NOT Operator, and return false in [right-0].
  */
}

// stopPropagation() - It prevent reaching the window object. Only known to clicked place. It won't bubbling.

isOpenCart.addEventListener("click", (e) => {
  e.stopPropagation();
  toggleCart(true);
});
isCloseCart.addEventListener("click", (e) => {
  e.stopPropagation();
  toggleCart(false);
});

cartPage.addEventListener("click", (e) => e.stopPropagation());
document.addEventListener("click", (e) => {
  e.stopPropagation();
  toggleCart(false);
});

const dropDownCategory = shopPage.querySelector("#category");
// Render the key as the option
function renderKeyValues(data) {
  // Clear the old options
  dropDownCategory.innerHTML = `<option disabled selected>Select Category...</option>`;

  // Loop through object keys
  Object.keys(data).forEach((keys) => {
    const option = document.createElement("option");
    option.value = keys;
    option.textContent = keys.charAt(0).toUpperCase() + keys.slice(1);
    dropDownCategory.appendChild(option);
  });

  let firstProductTitle = Object.keys(data)[0];
  const titleOfProduct = shopPage.querySelector("#titleOfProduct");
  titleOfProduct.textContent = firstProductTitle.toUpperCase();

  const optionsEl = dropDownCategory.querySelectorAll("option");
  optionsEl.forEach((opt) => {
    opt.addEventListener("click", () => {
      const optValue = opt.value;
      titleOfProduct.textContent = optValue.toUpperCase();
      renderProducts(products[optValue]);
    });
  });
}

const renderToDisplayProduct = shopPage.querySelector("#displayProduct");

// Render the products
function renderProducts(data) {
  //   console.table(data);

  renderToDisplayProduct.innerHTML = `
    ${
      data?.length >
      0 /* Make sure to check condition before render the products */
        ? data
            ?.map(
              (product) => `
            <figure class="flex flex-col gap-2 p-2 rounded-2xl transition-shadow hover:shadow-2xl cursor-pointer">
                <div class="h-2/3 rounded-2xl relative overflow-hidden">
                    <img loading="lazy" src="${product.Image[0].url}?random=${
                product?.id
              }" alt="${product.Image[0].imgName}" />
          ${
            product.trending &&
            `<span class="absolute top-2 right-2 p-1 px-2 rounded-xl bg-red-500 text-white">Hot Sale!</span>`
          }
                </div>
                <figcaption>
                    <table class="w-full">
                        <tbody>
                            <tr>
                                <th class="text-start p-2">Name: </th>
                                <td class="p-2 flex items-center gap-2">
                                    <p>${product.name}</p>
                                    
                                </td>
                            </tr>
                            <tr>
                                <th class="text-start p-2">Brand: </th>
                                <td class="p-2">${product.brand}</td>
                            </tr>
                            <tr>
                                <th class="text-start flex p-2">Description: </th>
                                <td class="p-2">
                                    <p class="line-clamp-2">${
                                      product.description
                                    }</p>
                                </td>
                            </tr>
                            <tr>
                                <th class="text-start flex p-2">Price: </th>
                                <td class="p-2">
                                    <p class="line-clamp-2">₹ ${(
                                      product.price * 87
                                    ).toFixed(2)}</p>
                                </td>
                            </tr>
                            <tr>
                                <th class="text-start p-2">Availability: </th>
                                <td class="p-2">
                                    <p style="color: ${
                                      product.inStock ? "palegreen" : "red"
                                    }">${product.availability}</p>
                                </td>
                            </tr>
                            <tr>
                                <td class="p-2"><button id="addToCart" class="outline w-full rounded-2xl py-1 text-lime-500 hover:bg-lime-500 hover:text-white" data-item="${encodeURIComponent(
                                  JSON.stringify(product)
                                )}">Add</button></td>
                                <td class="p-2"><button class="outline w-full rounded-2xl py-1 text-slate-500-500 hover:bg-slate-500 hover:text-white">View</button></td>
                            </tr>
                        </tbody>
                    </table>
                </figcaption>
            </figure>
        `
            )
            .join("")
        : `<h1 class="text-center font-bold col-span-2 lg:col-span-3">No Product Exist</h1>`
    }
  `;

  const addToCart = renderToDisplayProduct.querySelectorAll("#addToCart");

  addToCart.forEach((addBtn) => {
    addBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const item = JSON.parse(decodeURIComponent(addBtn.dataset.item));
      // This function prevent the duplicate of cart item by using some() method. If it any same cart exist already return true. Make we can condition to prevent that.
      const isCartExist = cart.some((it) => it.id === item.id);
      if (isCartExist) {
        console.warn("Cart already exist!");
        return;
      }
      cart.push(item);
      renderCartItem(cart);
      localStorage.setItem("Cart", JSON.stringify(cart));
    });
  });

  productFilterFunc(data);
}

// Body that will render the cart items

const tbody = cartPage.querySelector("tbody");
function renderCartItem(storedCart) {
  tbody.innerHTML = `
        ${
          storedCart.length > 0
            ? storedCart
                .map(
                  (cart) => `
                <tr class="flex items-center justify-between w-full">
                    <td class="w-20">
                        <img src="${cart.Image[0].url}?random=${
                    cart.id
                  }" alt="" />
                    </td>
                    <td class="w-2/6">
                        <h1>${cart.name}</h1>
                        <div class="flex items-center gap-2 mt-1">
                            <button onclick="handleIncrement(${
                              cart.id
                            })" class="w-6 rounded border">+</button>
                            <span>${cart.qty || 1}</span>
                            <button onclick="handleDecrement(${
                              cart.id
                            })" class="w-6 rounded border">-</button>
                        </div>
                    </td>
                    <td><p>₹ ${(cart.price * (cart.qty || 1) * 87).toFixed(
                      2
                    )}</p></td>
                    <td><button onclick="handleDelete(${
                      cart.id
                    })" class="border px-1 rounded text-red-500 hover:text-white hover:bg-red-500">Delete</button></td>
                </tr>
            `
                )
                .join("")
            : `
                <tr class="flex items-center">
                    <th colspan="2" class=" w-full">No Cart Added</th>
                </tr>
            `
        }
    `;

  totalPriceInCart(cart);
}

// Delete function for cart item
function handleDelete(id) {
  cart = cart.filter((item) => item.id !== id);

  // Call the function after filtered
  renderCartItem(cart);
  //   Next stored in localStorage
  localStorage.setItem("Cart", JSON.stringify(cart));
  // Every time deleteCart function called it will trigger the totalPrice function
  totalPriceInCart(cart);
}

// Increment for quantity & there will be new key added as qty in item
function handleIncrement(id) {
  cart = cart.map((item) =>
    item.id === id ? { ...item, qty: (item.qty || 1) + 1 } : item
  );

  // After increment function will call for render
  renderCartItem(cart);

  // And stored in localStorage
  localStorage.setItem("Cart", JSON.stringify(cart));

  // Every time increment function called it will trigger the totalPrice function
  totalPriceInCart(cart);
}

// Decrement for quantity & there will be new key added as qty in item
function handleDecrement(id) {
  cart = cart.map((item) =>
    item.id === id ? { ...item, qty: (item.qty || 1) - 1 } : item
  );

  // After decrement function will call for render
  renderCartItem(cart);

  // And stored in localStorage
  localStorage.setItem("Cart", JSON.stringify(cart));

  // Every time decrement function called it will trigger the totalPrice function
  totalPriceInCart(cart);
}

// Function for totalPrice in cart storage
function totalPriceInCart(cart) {
  const total = cart.reduce(
    (acc, item) => acc + item.price * (item.qty || 1) * 87,
    0
  );

  cartPage.querySelector(
    "#totalPrice"
  ).textContent = `Total Price: ₹ ${total.toFixed(2)}`;
  // console.info(total);

  return total.toFixed(2);
}

// Initially call function to render the cart item page
renderCartItem(cart);

// Product filtering
const productFilter = shopPage.querySelector("#productFilter");

function productFilterFunc(data) {
  // console.info(data)

  const optionForFilter = productFilter.querySelectorAll("option");

  optionForFilter.forEach((opt) => {
    opt.addEventListener("click", () => {
      const optValue = opt.value;
      toFilterProducts(optValue, data);
    });
  });
}

function toFilterProducts(type, data) {
  // Receiving two parameter as 'type' & 'data'
  // Why use spread operator for 'sort()' method. Because 'sort' modify the original array. So, we can't pass the data as a argument.
  // So, we use spread operator to take shallow from original array and stored in variable
  if (type === "alpha") {
    const alphaSort = [...data].sort((a, b) => a.name.localeCompare(b.name));
    renderProducts(alphaSort); // Alphabets order
  } else if (type === "lth") {
    const LTH = [...data].sort((a, b) => a.price - b.price);
    renderProducts(LTH); // Low To High
  } else if (type === "htl") {
    const HTL = [...data].sort((a, b) => b.price - a.price);
    renderProducts(HTL); // High To Low
  } else {
    console.error("Filter type not exist!");
  }
}

// Store the 'user' in localStorage -> User
let user = JSON.parse(localStorage.getItem("User")) || {};

// Register form
const registerPage = profilePage.querySelector("#register");
// Login form
const loginPage = profilePage.querySelector("#login");

// Register function
function registerFunc() {
  const registerForm = new FormData(registerPage);
  const registerObj = Object.fromEntries(registerForm.entries());
  user = registerObj;
  localStorage.setItem("User", JSON.stringify(user));
  // Register page
  if (registerPage.classList.contains("flex")) {
    registerPage.classList.remove("flex");
    registerPage.classList.add("hidden");
  }
  // Login page
  if (loginPage.classList.contains("hidden")) {
    loginPage.classList.remove("hidden");
    loginPage.classList.add("flex");
  }
}

// Login function
function loginFunc(user) {
  const loginForm = new FormData(loginPage);
  const loginObj = Object.fromEntries(loginForm.entries());
  if (user.email.trim() !== "" && user.pwd.trim() !== "") {
    if (loginObj.email === user.email && loginObj.pwd === user.pwd) {
      isUserLogged.name = user.user;
      localStorage.setItem("UserData", JSON.stringify(isUserLogged));
      showPages("home");
      homePageFunc(isUserLogged);
    }
  }
}

// Show Login page
const loginBtn = registerPage.querySelector("#toLogin");
loginBtn.addEventListener("click", () => {
  // console.info(loginBtn);
  // Register page
  if (registerPage.classList.contains("flex")) {
    registerPage.classList.remove("flex");
    registerPage.classList.add("hidden");
  }
  // Login page
  if (loginPage.classList.contains("hidden")) {
    loginPage.classList.remove("hidden");
    loginPage.classList.add("flex");
  }
});

// Show Register page
const registerBtn = loginPage.querySelector("#toRegister");
registerBtn.addEventListener("click", () => {
  // console.info(registerBtn);
  // Login page
  if (loginPage.classList.contains("flex")) {
    loginPage.classList.remove("flex");
    loginPage.classList.add("hidden");
  }
  // Register page
  if (registerPage.classList.contains("hidden")) {
    registerPage.classList.remove("hidden");
    registerPage.classList.add("flex");
  }
});

// Register addEventListener 'submit'
registerPage.addEventListener("submit", (e) => {
  e.preventDefault();
  registerFunc();
});
loginPage.addEventListener("submit", (e) => {
  e.preventDefault();
  loginFunc(user);
});
