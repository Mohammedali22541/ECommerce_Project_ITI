const BASE_URL = "https://ecommerce.routemisr.com";
const CART_URL = `${BASE_URL}/api/v1/cart`;

document.addEventListener("DOMContentLoaded", () => {
  getUserCart();

  const popupModal = document.getElementById("popupModal");
  popupModal?.addEventListener("click", function (e) {
    if (e.target === popupModal) {
      closeModal();
    }
  });
});

async function getUserCart() {
  const token = localStorage.getItem("token");
  const cartWrapper = document.getElementById("cartWrapper");
  const emptyCartSection = document.getElementById("emptyCartSection");

  if (!token) {
    window.location.href = "index.html";
    return;
  }

  try {
    const response = await fetch(CART_URL, {
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

    const cartDetails = result.data;
    const cartProducts = cartDetails.products || [];

    if (result.numOfCartItems === 0 || cartProducts.length === 0) {
      cartWrapper.innerHTML = "";
      emptyCartSection.classList.remove("hidden");
      return;
    }

    emptyCartSection.classList.add("hidden");
    cartWrapper.innerHTML = cartTemplate(cartDetails, result.numOfCartItems);
  } catch (error) {
    console.log("Get cart error:", error);
  }
}

function cartTemplate(cartDetails, cartItemsCount) {
  const productsHtml = cartDetails.products
    .map((cartProduct) => {
      const shortTitle = cartProduct.product.title
        .split(" ")
        .slice(0, 3)
        .join(" ");

      return `
        <div
          class="card bg-white rounded-[10px] flex flex-wrap justify-between items-center p-4"
        >
          <div class="flex items-center gap-[40px]">
            <div class="card-image h-[160px] w-[160px]">
              <img
                src="${cartProduct.product.imageCover}"
                class="w-full h-full rounded-[8px] object-contain"
                alt="${cartProduct.product.title}"
              />
            </div>

            <div class="card-details flex flex-col gap-[16px]">
              <h2 class="font-popins font-medium text-xl text-text">
                ${shortTitle}
              </h2>

              <div class="flex gap-[32px] items-center">
                <div
                  class="flex gap-[40px] bg-[#f6f6f6] border border-border rounded p-4"
                >
                  <button
                    class="cursor-pointer"
                    onclick="updateCartProductQuantity('${cartProduct.product.id}', ${cartProduct.count - 1})"
                  >
                    <span><i class="fa-solid fa-minus"></i></span>
                  </button>

                  <span
                    class="font-medium text-[20px] leading-[24px] font-popins"
                  >
                    ${cartProduct.count}
                  </span>

                  <button
                    class="cursor-pointer"
                    onclick="updateCartProductQuantity('${cartProduct.product.id}', ${cartProduct.count + 1})"
                  >
                    <span><i class="fa-solid fa-plus"></i></span>
                  </button>
                </div>

                <button
                  class="trachIcon"
                  onclick="removeSpecificCartItem('${cartProduct.product._id}')"
                >
                  <span class="text-2xl cursor-pointer  ">
                    <i class="fa-solid fa-trash text-[#8B5E35] hover:text-red-500"></i>
                  </span>
                </button>
              </div>
            </div>
          </div>

          <div
            class="card-price pr-2 font-popins font-semibold text-[20px] leading-[30px] text-text"
          >
            £${cartProduct.price}
          </div>
        </div>

        <div class="h-[1px] bg-[#D1D1D8]"></div>
      `;
    })
    .join("");

  const totalPrice = cartDetails.totalCartPrice || 0;
  const discount = totalPrice * 0.1;
  const finalTotal = totalPrice - discount;
  const futureDate = getFutureDateString(2);

  return `
    <div class="grid lg:grid-cols-[60%_minmax(0,1fr)] gap-20">
      <div class="cart-items space-y-[24px]">
        <div class="flex items-center gap-3 justify-between">
          <div class="flex items-center gap-3">
            <h2
              class="text-[#151411] font-popins font-semibold leading-[60px] text-[40px]"
            >
              Cart
            </h2>

            <span
              class="font-popins font-medium text-[18px] leading-[27px] text-main"
            >
              ${cartItemsCount} items
            </span>
          </div>

          <button
            onclick="showModal()"
            type="button"
            class="bg-red-500 cursor-pointer hover:bg-red-400 capitalize bg-main text-white px-4 py-2 rounded-lg flex gap-4 transition-colors duration-200"
          >
            Clear all cart items
            <span>
              <i class="fa-solid fa-trash fa-beat"></i>
            </span>
          </button>
        </div>

        ${productsHtml}

        <div
          class="bg-[#8B5E3542] border border-[#8B5E35] rounded-[10px] p-5 gap-[12px] flex items-center"
        >
          <span
            class="bg-main text-[#DADADA] flex justify-center items-center size-[40px] rounded-md"
            style="clip-path: polygon(50% 0%, 83% 12%, 100% 43%, 94% 78%, 68% 100%, 32% 100%, 6% 78%, 0% 43%, 17% 12%)"
          >
            <i class="fa-solid fa-percent"></i>
          </span>

          <p>
            10% Instant Discount with Federal Bank Debit Cards on a min spend of
            $150. TCA
          </p>
        </div>
      </div>

      <div
        class="order-summary flex flex-col gap-8 p-8 border border-[#D1D1D8] bg-white h-max"
      >
        <div class="order-info flex flex-col gap-6">
          <div
            class="price flex justify-between items-center font-popins font-normal text-base text-text"
          >
            <h3>price</h3>
            <span>£${totalPrice.toFixed(2)}</span>
          </div>

          <div
            class="discount flex justify-between items-center font-popins font-normal text-base text-blue-600"
          >
            <h3>Discount</h3>
            <span>£${discount.toFixed(2)}</span>
          </div>

          <div
            class="Shipping flex justify-between items-center font-popins font-normal text-base text-text"
          >
            <h3>Shipping</h3>
            <span class="text-main">free</span>
          </div>

          <div
            class="price flex justify-between items-center font-popins font-normal text-base text-text"
          >
            <h3>Coupon Applied</h3>
            <span>£0.00</span>
          </div>
        </div>

        <div class="h-[1px] bg-[#D1D1D8]"></div>

        <div class="order-total flex flex-col gap-6">
          <div
            class="total flex justify-between items-center font-popins font-normal text-base text-text"
          >
            <h3>Total</h3>
            <span>£${finalTotal.toFixed(2)}</span>
          </div>

          <div
            class="total flex justify-between items-center font-popins font-normal text-base text-text"
          >
            <h3>Estimated Delivery by</h3>
            <span class="font-semibold">${futureDate}</span>
          </div>

          <div class="input-group relative">
            <input
              type="text"
              placeholder="Coupon Code"
              class="rounded-[10px] py-4 pr-2 pl-4 border border-[#C0C0C0] w-full"
            />

            <button
              class="rounded-[8px] bg-main text-white px-5 py-2 font-popins font-semibold text-base absolute right-[2%] top-1/2 -translate-y-1/2"
            >
              Apply
            </button>
          </div>

          <button
            class="bg-main rounded-[32px] py-4 font-popins font-semibold text-xl text-white"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  `;
}

async function updateCartProductQuantity(productId, count) {
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "index.html";
    return;
  }

  if (count < 1) {
    await removeSpecificCartItem(productId);
    return;
  }

  try {
    const response = await fetch(`${CART_URL}/${productId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      body: JSON.stringify({
        count: count,
      }),
    });

    const result = await response.json();

    if (response.ok) {
      getUserCart();
    } else {
      console.log(result);
    }
  } catch (error) {
    console.log("Update quantity error:", error);
  }
}

async function removeSpecificCartItem(productId) {
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "index.html";
    return;
  }

  try {
    const response = await fetch(`${CART_URL}/${productId}`, {
      method: "DELETE",
      headers: {
        token: token,
      },
    });

    const result = await response.json();

    if (response.ok) {
      getUserCart();
    } else {
      console.log(result);
    }
  } catch (error) {
    console.log("Remove cart item error:", error);
  }
}

async function clearUserCart() {
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "index.html";
    return;
  }

  try {
    const response = await fetch(CART_URL, {
      method: "DELETE",
      headers: {
        token: token,
      },
    });

    const result = await response.json();

    if (response.ok) {
      closeModal();
      getUserCart();
    } else {
      console.log(result);
    }
  } catch (error) {
    console.log("Clear cart error:", error);
  }
}

function showModal() {
  const popupModal = document.getElementById("popupModal");
  popupModal.classList.remove("hidden");
  popupModal.classList.add("flex");
}

function closeModal() {
  const popupModal = document.getElementById("popupModal");
  popupModal.classList.remove("flex");
  popupModal.classList.add("hidden");
}

function getFutureDateString(daysToAdd) {
  const date = new Date();
  date.setDate(date.getDate() + daysToAdd);

  return date.toDateString();
}
