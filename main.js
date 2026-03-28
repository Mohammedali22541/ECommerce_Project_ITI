const BASE_URL = "https://ecommerce.routemisr.com";
const SIGNUP_URL = `${BASE_URL}/api/v1/auth/signup`;
const SIGNIN_URL = `${BASE_URL}/api/v1/auth/signin`;

document.addEventListener("DOMContentLoaded", () => {
  initializeAuthPages();
});

function initializeAuthPages() {
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");

  if (loginForm) {
    loginForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      await handleLogin();
    });
  }

  if (registerForm) {
    registerForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      await handleRegister();
    });
  }
}

async function handleLogin() {
  const emailInput = document.getElementById("signEmail");
  const passwordInput = document.getElementById("signPass");
  const userMessage = document.getElementById("userMessage");
  const emailError = document.getElementById("emailError");
  const passwordError = document.getElementById("passwordError");
  const loginButton = document.getElementById("login");
  const loginButtonText = document.getElementById("loginButtonText");
  const loginSpinner = document.getElementById("loginSpinner");

  if (
    !emailInput ||
    !passwordInput ||
    !userMessage ||
    !emailError ||
    !passwordError ||
    !loginButton ||
    !loginButtonText ||
    !loginSpinner
  ) {
    return;
  }

  clearLoginErrors();

  const formData = {
    email: emailInput.value.trim(),
    password: passwordInput.value,
  };

  let isValid = true;

  if (formData.email === "") {
    showFieldError(emailError, "Email is required");
    emailInput.classList.add("input-error");
    isValid = false;
  } else if (!validateEmail(formData.email)) {
    showFieldError(emailError, "Please enter a valid email address");
    emailInput.classList.add("input-error");
    isValid = false;
  }

  if (formData.password === "") {
    showFieldError(passwordError, "Password is required");
    passwordInput.classList.add("input-error");
    isValid = false;
  }

  if (!isValid) {
    return;
  }

  setLoginLoading(true);

  try {
    const response = await fetch(SIGNIN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const result = await response.json();

    if (response.ok && result.message === "success") {
      localStorage.setItem("token", result.token);
      showMessage(userMessage, "Success", "success");

      setTimeout(() => {
        window.location.href = "homePage.html";
      }, 500);
    } else {
      showMessage(
        userMessage,
        result.message || "Invalid email or password",
        "error",
      );
    }
  } catch (error) {
    console.log("Login error:", error);
    showMessage(
      userMessage,
      "Something went wrong. Please try again.",
      "error",
    );
  } finally {
    setLoginLoading(false);
  }

  function setLoginLoading(isLoading) {
    loginButton.disabled = isLoading;

    if (isLoading) {
      loginButtonText.textContent = "Sign In ";
      loginSpinner.classList.remove("hidden");
    } else {
      loginButtonText.textContent = "Sign In";
      loginSpinner.classList.add("hidden");
    }
  }
}

async function handleRegister() {
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const rePasswordInput = document.getElementById("rePassword");
  const phoneInput = document.getElementById("phone");
  const termsInput = document.getElementById("terms");
  const userMessage = document.getElementById("userMessage");

  const nameError = document.getElementById("nameError");
  const emailError = document.getElementById("registerEmailError");
  const passwordError = document.getElementById("registerPasswordError");
  const rePasswordError = document.getElementById("rePasswordError");
  const phoneError = document.getElementById("phoneError");
  const termsError = document.getElementById("termsError");

  const registerButton = document.getElementById("signUp");
  const registerButtonText = document.getElementById("registerButtonText");
  const registerSpinner = document.getElementById("registerSpinner");

  if (
    !nameInput ||
    !emailInput ||
    !passwordInput ||
    !rePasswordInput ||
    !phoneInput ||
    !termsInput ||
    !userMessage ||
    !nameError ||
    !emailError ||
    !passwordError ||
    !rePasswordError ||
    !phoneError ||
    !termsError ||
    !registerButton ||
    !registerButtonText ||
    !registerSpinner
  ) {
    return;
  }

  clearRegisterErrors();

  const formData = {
    name: nameInput.value.trim(),
    email: emailInput.value.trim(),
    password: passwordInput.value,
    rePassword: rePasswordInput.value,
    phone: phoneInput.value.trim(),
  };

  let isValid = true;

  if (formData.name === "") {
    showFieldError(nameError, "Name is required");
    nameInput.classList.add("input-error");
    isValid = false;
  } else if (formData.name.length < 3) {
    showFieldError(nameError, "Name must be at least 3 characters");
    nameInput.classList.add("input-error");
    isValid = false;
  } else if (formData.name.length > 20) {
    showFieldError(nameError, "Name must not exceed 20 characters");
    nameInput.classList.add("input-error");
    isValid = false;
  }

  if (formData.email === "") {
    showFieldError(emailError, "Email is required");
    emailInput.classList.add("input-error");
    isValid = false;
  } else if (!validateEmail(formData.email)) {
    showFieldError(emailError, "Please enter a valid email address");
    emailInput.classList.add("input-error");
    isValid = false;
  }

  if (formData.password === "") {
    showFieldError(passwordError, "Password is required");
    passwordInput.classList.add("input-error");
    isValid = false;
  } else if (formData.password.length < 8) {
    showFieldError(passwordError, "Password must be at least 8 characters");
    passwordInput.classList.add("input-error");
    isValid = false;
  } else if (!/[a-zA-Z]/.test(formData.password)) {
    showFieldError(passwordError, "Password must contain at least one letter");
    passwordInput.classList.add("input-error");
    isValid = false;
  } else if (!/\d/.test(formData.password)) {
    showFieldError(passwordError, "Password must contain at least one number");
    passwordInput.classList.add("input-error");
    isValid = false;
  } else if (!/[^a-zA-Z0-9]/.test(formData.password)) {
    showFieldError(
      passwordError,
      "Password must contain at least one special character",
    );
    passwordInput.classList.add("input-error");
    isValid = false;
  }

  if (formData.rePassword === "") {
    showFieldError(rePasswordError, "Please confirm your password");
    rePasswordInput.classList.add("input-error");
    isValid = false;
  } else if (formData.password !== formData.rePassword) {
    showFieldError(rePasswordError, "Passwords do not match");
    rePasswordInput.classList.add("input-error");
    isValid = false;
  }

  if (formData.phone === "") {
    showFieldError(phoneError, "Phone number is required");
    phoneInput.classList.add("input-error");
    isValid = false;
  } else if (!/^01[0125][0-9]{8}$/.test(formData.phone)) {
    showFieldError(phoneError, "Please enter a valid phone number");
    phoneInput.classList.add("input-error");
    isValid = false;
  }

  if (!termsInput.checked) {
    showFieldError(
      termsError,
      "You must agree to the terms and conditions to continue.",
    );
    isValid = false;
  }

  if (!isValid) {
    return;
  }

  setRegisterLoading(true);

  try {
    const response = await fetch(SIGNUP_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const result = await response.json();

    if (response.ok && result.message === "success") {
      showMessage(
        userMessage,
        "Your signup was successful. Redirecting...",
        "success",
      );

      clearRegisterInputs();

      setTimeout(() => {
        window.location.href = "index.html";
      }, 800);
    } else {
      showMessage(
        userMessage,
        result.message || "Registration failed. Please try again.",
        "warning",
      );
    }
  } catch (error) {
    console.log("Register error:", error);
    showMessage(
      userMessage,
      "Something went wrong. Please try again.",
      "error",
    );
  } finally {
    setRegisterLoading(false);
  }

  function setRegisterLoading(isLoading) {
    registerButton.disabled = isLoading;

    if (isLoading) {
      registerButtonText.textContent = "Register new account ";
      registerSpinner.classList.remove("hidden");
    } else {
      registerButtonText.textContent = "Register new account";
      registerSpinner.classList.add("hidden");
    }
  }
}

function clearLoginErrors() {
  const emailError = document.getElementById("emailError");
  const passwordError = document.getElementById("passwordError");
  const emailInput = document.getElementById("signEmail");
  const passwordInput = document.getElementById("signPass");
  const userMessage = document.getElementById("userMessage");

  if (emailError) {
    emailError.classList.add("hidden");
    emailError.innerHTML = "";
  }

  if (passwordError) {
    passwordError.classList.add("hidden");
    passwordError.innerHTML = "";
  }

  emailInput?.classList.remove("input-error");
  passwordInput?.classList.remove("input-error");

  if (userMessage) {
    userMessage.classList.add("hidden");
    userMessage.innerHTML = "";
  }
}

function clearRegisterErrors() {
  const errorIds = [
    "nameError",
    "registerEmailError",
    "registerPasswordError",
    "rePasswordError",
    "phoneError",
    "termsError",
  ];

  const inputIds = ["name", "email", "password", "rePassword", "phone"];
  const userMessage = document.getElementById("userMessage");

  errorIds.forEach((id) => {
    const errorElement = document.getElementById(id);
    if (errorElement) {
      errorElement.classList.add("hidden");
      errorElement.innerHTML = "";
    }
  });

  inputIds.forEach((id) => {
    const inputElement = document.getElementById(id);
    inputElement?.classList.remove("input-error");
  });

  if (userMessage) {
    userMessage.classList.add("hidden");
    userMessage.innerHTML = "";
  }
}

function showFieldError(element, message) {
  element.classList.remove("hidden");
  element.innerHTML = `
    <div class="flex items-center gap-2">
      <span class="font-medium">Ensure that these requirements are met:</span>
    </div>
    <ul class="mt-1.5 list-disc list-inside">
      <li>${message}</li>
    </ul>
  `;
}

function clearRegisterInputs() {
  const ids = ["name", "email", "password", "rePassword", "phone"];

  ids.forEach((id) => {
    const element = document.getElementById(id);
    if (element) {
      element.value = "";
    }
  });

  const terms = document.getElementById("terms");
  if (terms) {
    terms.checked = false;
  }
}

function showMessage(element, message, type) {
  element.innerHTML = message;
  element.classList.remove(
    "hidden",
    "bg-red-500",
    "bg-green-500",
    "bg-yellow-500",
    "text-white",
  );

  element.classList.add("block", "text-white");

  if (type === "success") {
    element.classList.add("bg-green-500");
  } else if (type === "warning") {
    element.classList.add("bg-yellow-500");
  } else {
    element.classList.add("bg-red-500");
  }
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "index.html";
}
