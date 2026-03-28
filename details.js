const BASE_URL = "https://ecommerce.routemisr.com";
const CART_URL = `${BASE_URL}/api/v1/cart`;

let count = 1;

document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");

  if (!productId) return;

  await getProductDetails(productId);

  setupQuantity(productId);
});

async function getProductDetails(id) {
  try {
    const response = await fetch(
      `https://ecommerce.routemisr.com/api/v1/products/${id}`
    );
    const result = await response.json();

    const product = result.data;

    document.getElementById("mainImage").src = product.imageCover;
    document.getElementById("title").textContent = product.title;
    document.getElementById("description").textContent =
      product.description;
    document.getElementById("price").textContent = product.price;
    document.getElementById("rating").textContent =
      product.ratingsAverage;
  } catch (error) {
    console.log(error);
  }
}

function setupQuantity(productId) {
  const countSpan = document.getElementById("count");

  document.getElementById("plus").onclick = () => {
    count++;
    countSpan.textContent = count;
  };

  document.getElementById("minus").onclick = () => {
    if (count > 1) count--;
    countSpan.textContent = count;
  };

  document.getElementById("addToCart").onclick = () =>
    addToCart(productId);
}

async function addToCart(productId) {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Login first");
    return;
  }

  try {
    const response = await fetch(CART_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      body: JSON.stringify({ productId }),
    });

    const result = await response.json();

    if (response.ok) {
      alert("Added to cart");
    }
  } catch (error) {
    console.log(error);
  }
}