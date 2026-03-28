const BASE_URL = "https://ecommerce.routemisr.com";
const WISHLIST_URL = `${BASE_URL}/api/v1/wishlist`;
const CART_URL = `${BASE_URL}/api/v1/cart`;

document.addEventListener("DOMContentLoaded", () => {
  getUserWishlist();
});

async function getUserWishlist() {
  const token = localStorage.getItem("token");
  const wishlistContainer = document.getElementById("wishlistContainer");
  const emptyMessage = document.getElementById("wishlistEmptyMessage");

  if (!token) {
    window.location.href = "index.html";
    return; 
  }

  if (!wishlistContainer || !emptyMessage) {
    return;
  }

  try {
    const response = await fetch(WISHLIST_URL, {
      method: "GET",
      headers: {
        token: token,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      console.log(result);
      return;
    }

    const products = result.data || [];

    if (products.length === 0) {
      wishlistContainer.innerHTML = "";
      emptyMessage.classList.remove("hidden");
      return;
    }

    emptyMessage.classList.add("hidden");

    wishlistContainer.innerHTML = products
      .map((product) => wishlistCardTemplate(product))
      .join("");
  } catch (error) {
    console.log("Wishlist error:", error);
  }
}

function wishlistCardTemplate(product) {
  const shortTitle = product.title
    ? product.title.split(" ").slice(0, 3).join(" ")
    : "";

  const oldPrice = product.price
    ? (product.price + product.price * 0.1).toFixed(2)
    : "0.00";

  return `
    <div class="relative">
      <div
        class="all-card bg-white px-3 py-4 rounded-[10px] drop-shadow-md h-[600px] flex flex-col justify-between relative cursor-pointer"
        onclick="goToDetails('${product.id || product._id}')"
      >
        <div class="img-container mb-4 relative overflow-hidden">
          <img
            src="${product.imageCover}"
            class="w-full rounded-[10px] object-contain"
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
              onclick="addWishlistProductToCart('${product._id}', event)"
              class="bg-main flex justify-center items-center size-[35px] text-white cursor-pointer rounded-[10px] bg-green-500 transition-colors duration-200"
            >
              <i class="fa-solid fa-cart-shopping"></i>
            </button>

            <button
              type="button"
              onclick="deleteProductFromWishlist('${product._id}', event)"
              class="bg-red-500 flex justify-center items-center cursor-pointer size-[35px] text-white rounded-[10px] hover:bg-red-600 transition-colors duration-200"
            >
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function goToDetails(productId) {
  window.location.href = `details.html?id=${productId}`;
}

async function deleteProductFromWishlist(productId, event) {
  if (event) {
    event.stopPropagation();
  }

  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "index.html";
    return;
  }

  try {
    const response = await fetch(`${WISHLIST_URL}/${productId}`, {
      method: "DELETE",
      headers: {
        token: token,
      },
    });

    const result = await response.json();

    if (response.ok) {
      alert(result.message || "Removed from wishlist");
      getUserWishlist();
    } else {
      console.log(result);
    }
  } catch (error) {
    console.log("Delete wishlist product error:", error);
  }
}

async function addWishlistProductToCart(productId, event) {
  if (event) {
    event.stopPropagation();
  }

  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "index.html";
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
      alert(result.message || "Product added to cart");
    } else {
      console.log(result);
    }
  } catch (error) {
    console.log("Add wishlist product to cart error:", error);
  }
}