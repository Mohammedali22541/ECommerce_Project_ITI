const BASE_URL = "https://ecommerce.routemisr.com";
const PRODUCTS_URL = `${BASE_URL}/api/v1/products`;
const CATEGORIES_URL = `${BASE_URL}/api/v1/categories`;
const CART_URL = `${BASE_URL}/api/v1/cart`;
const WISHLIST_URL = `${BASE_URL}/api/v1/wishlist`;

document.addEventListener("DOMContentLoaded", () => {
  setupNavbar();

  if (document.getElementById("flashSaleContainer")) {
    initializeHomePage();
  }

  if (document.getElementById("productsCategoryTabs")) {
    initializeProductsPage();
  }
});

function setupNavbar() {
  const navbar = document.getElementById("navbar");
  const navLinks = document.querySelectorAll(".nav-link");
  const cartIcon = document.getElementById("cartIcon");
  const wishlistIcon = document.getElementById("wishlistIcon");
  const cartCount = document.getElementById("cartCount");
  const wishlistCount = document.getElementById("wishlistCount");
  const menuToggle = document.getElementById("menuToggle");
  const navbarMenu = document.getElementById("navbarMenu");

  if (!navbar || !cartIcon || !wishlistIcon || !menuToggle || !navbarMenu) {
    return;
  }

  const currentPage = window.location.pathname.split("/").pop();
  const isHomePage =
    currentPage === "homePage.html" ||
    currentPage === "" ||
    currentPage === "index.html";

  function setActiveLink() {
    navLinks.forEach((link) => {
      const href = link.getAttribute("href").replace("./", "");

      if (href === currentPage) {
        link.classList.add("link-active");
      } else {
        link.classList.remove("link-active");
      }
    });
  }

  function setDarkNavbar() {
    navbar.classList.remove("bg-white");
    navbar.classList.add("bg-transparent");

    navLinks.forEach((link) => {
      link.classList.remove("text-black");
      link.classList.add("text-white");
    });

    cartIcon.classList.remove("text-black");
    cartIcon.classList.add("text-white");

    wishlistIcon.classList.remove("text-black");
    wishlistIcon.classList.add("text-white");

    menuToggle.classList.remove("text-black");
    menuToggle.classList.add("text-white");
  }

  function setLightNavbar() {
    navbar.classList.remove("bg-transparent");
    navbar.classList.add("bg-white");

    navLinks.forEach((link) => {
      link.classList.remove("text-white");
      link.classList.add("text-black");
    });

    cartIcon.classList.remove("text-white");
    cartIcon.classList.add("text-black");

    wishlistIcon.classList.remove("text-white");
    wishlistIcon.classList.add("text-black");

    menuToggle.classList.remove("text-white");
    menuToggle.classList.add("text-black");
  }

  function handleScroll() {
    if (!isHomePage) {
      setLightNavbar();
      return;
    }

    if (window.scrollY > 0) {
      setLightNavbar();
    } else {
      setDarkNavbar();
    }
  }

  menuToggle.addEventListener("click", () => {
    navbarMenu.classList.toggle("hidden");
  });

  window.addEventListener("scroll", handleScroll);

  setActiveLink();
  handleScroll();
  loadNavbarCounts(cartCount, wishlistCount);
}

async function loadNavbarCounts(cartCountElement, wishlistCountElement) {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    const cartResponse = await fetch(CART_URL, {
      method: "GET",
      headers: {
        token: token,
      },
    });

    const cartResult = await cartResponse.json();
    const cartCount = cartResult.numOfCartItems || 0;

    cartCountElement.textContent = cartCount;

    if (cartCount > 0) {
      cartCountElement.classList.remove("hidden");
    } else {
      cartCountElement.classList.add("hidden");
    }
  } catch (error) {
    console.log("Cart count error:", error);
  }

  try {
    const wishlistResponse = await fetch(WISHLIST_URL, {
      method: "GET",
      headers: {
        token: token,
      },
    });

    const wishlistResult = await wishlistResponse.json();
    const wishlistCount = wishlistResult.data ? wishlistResult.data.length : 0;

    wishlistCountElement.textContent = wishlistCount;

    if (wishlistCount > 0) {
      wishlistCountElement.classList.remove("hidden");
    } else {
      wishlistCountElement.classList.add("hidden");
    }
  } catch (error) {
    console.log("Wishlist count error:", error);
  }
}

function productCardTemplate(product, showAddedIcon = true) {
  const shortTitle = product.title
    ? product.title.split(" ").slice(0, 3).join(" ")
    : "";

  const oldPrice = product.price
    ? (product.price + product.price * 0.1).toFixed(2)
    : "0.00";

  return `
    <div class="relative">
      <div
        class="all-card bg-white px-3 py-4 rounded-[10px] drop-shadow-md cursor-pointer h-[600px] flex flex-col justify-between relative"
        onclick="goToDetails('${product.id || product._id}')"
      >
        <div class="img-container mb-4 relative overflow-hidden">
          <img
            src="${product.imageCover}"
            class="w-full rounded-[10px] object-contain hover:scale-125 transition-transform duration-[0.9s] ease"
            alt="${product.title}"
          />

          <span
            class="absolute bg-[#8B5E35] bottom-[4%] left-[2%] text-center rounded-sm text-[25px] leading-[30px] font-semibold font-Inter text-white w-[85px] py-1 px-[6px]"
          >
            -10%
          </span>
        </div>

        <div class="card-body space-y-2">
          <h3 class="font-popins font-medium text-2xl leading-[36px]">
            ${shortTitle}
          </h3>

          <div class="rating space-x-1">
            <span class="text-[#FFC000]"><i class="fa-solid fa-star"></i></span>
            <span>${product.ratingsAverage ?? ""}</span>
            <span class="font-popins font-medium text-[12px] leading-[18px] text-Thirdtext">
              (${product.ratingsQuantity ?? 0})
            </span>
          </div>
        </div>

        <div class="card-footer flex justify-between items-center">
          <div class="price font-popins font-semibold text-xl leading-[30px] text-Secondtext space-x-2">
            <span class="text-main">£${product.price ?? 0}</span>
            <span class="line-through">£${oldPrice}</span>
          </div>

          <div class="flex items-center gap-2">
            <button
              type="button"
              onclick="addToCart('${product._id}', event)"
              class="bg-main flex justify-center items-center size-[35px] text-white cursor-pointer rounded-[10px] bg-green-500 hover:bg-green-300 transition-colors duration-200"
            >
              <i class="fa-solid fa-plus"></i>
            </button>
          </div>
        </div>
      </div>

      ${
        showAddedIcon
          ? `
          <span
            onclick="addToWishlist('${product._id}', event)"
            class="absolute top-[5%] right-[5%] bg-gray-200 text-[#8B5E35] size-[45px] rounded-full flex justify-center cursor-pointer items-center hover:bg-["#8B5E35] hover:text-gray-200 transition-colors duration-300 ease-in"
          >
            <i class="fa-regular fa-heart"></i>
          </span>
        `
          : ""
      }
    </div>
  `;
}

function goToDetails(productId) {
  window.location.href = `details.html?id=${productId}`;
}

async function addToCart(productId, event) {
  event.stopPropagation();

  const token = localStorage.getItem("token");

  if (!token) {
    alert("You need to login first.");
    return;
  }

  try {
    const response = await fetch(CART_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      body: JSON.stringify({
        productId: productId,
      }),
    });

    const result = await response.json();

    if (response.ok) {
      updateNavbarCartCount(result.numOfCartItems);
      alert(result.message || "Product added successfully");
    } else {
      console.log(result);
    }
  } catch (error) {
    console.log("Add to cart error:", error);
  }
}

async function addToWishlist(productId, event) {
  event.stopPropagation();

  const token = localStorage.getItem("token");

  if (!token) {
    alert("You need to login first.");
    return;
  }

  try {
    const response = await fetch(WISHLIST_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      body: JSON.stringify({
        productId: productId,
      }),
    });

    const result = await response.json();

    if (response.ok) {
      const wishlistCount = result.data ? result.data.length : 0;
      updateNavbarWishlistCount(wishlistCount);
      alert(result.message || "Added to wishlist");
    } else {
      console.log(result);
    }
  } catch (error) {
    console.log("Add to wishlist error:", error);
  }
}

function updateNavbarCartCount(count) {
  const element = document.getElementById("cartCount");
  if (!element) return;

  element.textContent = count;

  if (count > 0) {
    element.classList.remove("hidden");
  } else {
    element.classList.add("hidden");
  }
}

function updateNavbarWishlistCount(count) {
  const element = document.getElementById("wishlistCount");
  if (!element) return;

  element.textContent = count;

  if (count > 0) {
    element.classList.remove("hidden");
  } else {
    element.classList.add("hidden");
  }
}

async function initializeHomePage() {
  await renderFlashSaleProducts();
  await renderCategoryTabs({
    tabsId: "categoryTabs",
    productsId: "categoryProductsContainer",
    takeSlice: true,
  });
  await renderTopProducts();
}

async function renderFlashSaleProducts() {
  const container = document.getElementById("flashSaleContainer");
  if (!container) return;

  try {
    const response = await fetch(PRODUCTS_URL);
    const result = await response.json();
    const products = result.data || [];
    const flashProducts = products.slice(31, 39);

    container.innerHTML = flashProducts
      .map((product) => productCardTemplate(product, true))
      .join("");
  } catch (error) {
    console.log("Flash sale error:", error);
  }
}

async function renderTopProducts() {
  const container = document.getElementById("topProductsContainer");
  if (!container) return;

  try {
    const response = await fetch(`${PRODUCTS_URL}?page=2`);
    const result = await response.json();
    const products = result.data || [];
    const topProducts = products.slice(4, 8);

    container.innerHTML = topProducts
      .map((product) => productCardTemplate(product, true))
      .join("");
  } catch (error) {
    console.log("Top products error:", error);
  }
}

async function initializeProductsPage() {
  await renderCategoryTabs({
    tabsId: "productsCategoryTabs",
    productsId: "productsPageContainer",
    takeSlice: false,
  });
}

async function renderCategoryTabs(options) {
  const tabsContainer = document.getElementById(options.tabsId);
  const productsContainer = document.getElementById(options.productsId);

  if (!tabsContainer || !productsContainer) return;

  try {
    const response = await fetch(CATEGORIES_URL);
    const result = await response.json();
    const categories = result.data || [];

    const neededCategories = categories.filter((category) => {
      return (
        category.name === "Men's Fashion" ||
        category.name === "Women's Fashion" ||
        category.name === "Electronics"
      );
    });

    tabsContainer.innerHTML = neededCategories
      .map((category, index) => {
        return `
          <li class="me-2" role="presentation">
            <button
              class="category-tab inline-block p-4 border-b-2 rounded-t-lg transition-all duration-300 ${
                index === 0
                  ? "tab-active"
                  : "text-gray-500 border-transparent hover:text-main hover:border-main"
              }"
              data-id="${category._id}"
              type="button"
            >
              ${category.name}
            </button>
          </li>
        `;
      })
      .join("");

    const buttons = tabsContainer.querySelectorAll(".category-tab");

    buttons.forEach((button) => {
      button.addEventListener("click", async function () {
        buttons.forEach((btn) => {
          btn.className =
            "category-tab inline-block p-4 border-b-2 rounded-t-lg transition-all duration-300 text-gray-500 border-transparent hover:text-main hover:border-main";
        });

        this.className =
          "category-tab inline-block p-4 border-b-2 rounded-t-lg transition-all duration-300 tab-active";

        await renderProductsByCategory(
          this.dataset.id,
          options.productsId,
          options.takeSlice,
        );
      });
    });

    if (neededCategories.length > 0) {
      await renderProductsByCategory(
        neededCategories[0]._id,
        options.productsId,
        options.takeSlice,
      );
    }
  } catch (error) {
    console.log("Tabs error:", error);
  }
}

async function renderProductsByCategory(categoryId, containerId, takeSlice) {
  const container = document.getElementById(containerId);
  if (!container) return;

  try {
    const response = await fetch(`${PRODUCTS_URL}?category[in]=${categoryId}`);
    const result = await response.json();
    let products = result.data || [];

    if (takeSlice) {
      products = products.slice(7, 11);
    }

    container.innerHTML = products
      .map((product) => productCardTemplate(product, true))
      .join("");
  } catch (error) {
    console.log("Products by category error:", error);
  }
}
