// Cart
let cartIcon = document.querySelector("#cart-icon");
let cart = document.querySelector(".cart");
let closeCart = document.querySelector("#close-cart");

//open cart
cartIcon.onclick = () => {
  cart.classList.add("active");
};
//close cart
closeCart.onclick = () => {
  cart.classList.remove("active");
};

//cart working js
if (document.readyState == "loading") {
  document.addEventListener("DOMContentLoaded", ready);
} else {
  ready();
}

//Making Function
function ready() {
  //remove items from cart
  var removeCartButtons = document.getElementsByClassName("cart-remove");
  console.log(removeCartButtons);
  for (var i = 0; i < removeCartButtons.length; i++) {
    var button = removeCartButtons[i];
    button.addEventListener("click", removeCartItem);
  }
  //Quantity Changes
  var quantityInputs = document.getElementsByClassName("cart-quantity");
  for (var j = 0; j < quantityInputs.length; j++) {
    var input = quantityInputs[j];
    input.addEventListener("change", quantityChanged);
  }
  //Add to Cart
  var addCart = document.getElementsByClassName("add-cart");
  for (var i = 0; i < addCart.length; i++) {
    var buttton = addCart[i];
    buttton.addEventListener("click", addToCart);
  }
  //BUY BUTTON
  document
    .getElementsByClassName("btn-buy")[0]
    .addEventListener("click", buyButtonClicked);
}
//Defining product availability
const productAvailability = {
  "ZARA PRINTED SHIRT": true,
  "BOAT AIRDOPES 148": true,
  "ROADSTER HOODIES": true,
  "MILTON WATER BOTTLE": false,
  "RAY-BAN SUNGLASSES": true,
  "NEWYORK CITY HAT": true,
  "HARRISONS BAG": true,
  "ADIDAS SHOES": true,
  "HP LAPTOP": true,
};

function buyButtonClicked() {
  var cartContent = document.getElementsByClassName("cart-content")[0];
  var cartBoxes = cartContent.getElementsByClassName("cart-box");

  // Check whether the cart is empty or not
  if (cartBoxes.length === 0) {
    alert("Your cart is empty. Add items to your cart before purchase.");
    return;
  }

  // Check product availability before proceeding with the purchase
  for (var i = 0; i < cartBoxes.length; i++) {
    var cartBox = cartBoxes[i];
    var titleElement = cartBox.getElementsByClassName("cart-product-title")[0];
    var title = titleElement.innerText.trim(); // Trim any leading/trailing whitespace

    var isAvailable = productAvailability[title];

    // Check if the product is available or not
    if (!isAvailable) {
      alert(`${title} is currently out of stock.`);
      return;
    }
  }

  // If all products are available, proceed with the purchase
  alert("Your order has been placed");

  // Clear the cart
  while (cartContent.hasChildNodes()) {
    cartContent.removeChild(cartContent.firstChild);
  }
  // change discount to initial value
  discountPercentage = 0;
  discountApplied = false;
  // Update the total (you need to implement this function)
  updateTotal();
  handleEmptyCartAndOrderPlaced();
}

//remove items from cart
function removeCartItem(event) {
  var buttonClicked = event.target;
  buttonClicked.parentElement.remove();
  discountPercentage = 0;
  discountApplied = false;
  updateTotal();
  handleEmptyCartAndOrderPlaced();
}
//Quantity Changes
function quantityChanged() {
  var input = event.target;
  if (isNaN(input.value) || input.value <= 0) {
    input.value = 1;
  }
  updateTotal();
}

//add To Cart
function addToCart() {
  var button = event.target;
  var shopProducts = button.parentElement;
  var title = shopProducts.getElementsByClassName("product-title")[0].innerText;
  var price = shopProducts.getElementsByClassName("price")[0].innerText;
  var productImg = shopProducts.getElementsByClassName("product-img")[0].src;

  addProductToCart(title, price, productImg);
  updateTotal();
  
}
//add Product To Cart
function addProductToCart(title, price, productImg) {
  var cartShopBox = document.createElement("div");
  cartShopBox.classList.add("cart-box");
  var cartItems = document.getElementsByClassName("cart-content")[0];
  var cartItemsNames = cartItems.getElementsByClassName("cart-product-title");
  for (var i = 0; i < cartItemsNames.length; i++) {
    if (cartItemsNames[i].innerText == title) {
      alert("Item Successfully added to Your Cart");
      return;
    }
  }
  var cartBoxContent = ` 
                    <img src="${productImg}" alt="" class="cart-img">
                    <div class="detail-box">
                       <div class="cart-product-title">${title}</div>
                       <div class="cart-price">${price}</div>
                       <input type="number" value="1" class="cart-quantity">
                    </div>
                    <!--Remove item from cart -->
                    <i class='bx bxs-trash-alt cart-remove' ></i>
`;
  cartShopBox.innerHTML = cartBoxContent;
  cartItems.append(cartShopBox);
  cartShopBox
    .getElementsByClassName("cart-remove")[0]
    .addEventListener("click", removeCartItem);
  cartShopBox
    .getElementsByClassName("cart-quantity")[0]
    .addEventListener("change", quantityChanged);
}
//Update Total
function updateTotal() {
  var cartContent = document.getElementsByClassName("cart-content")[0];
  var cartBoxes = cartContent.getElementsByClassName("cart-box");
  var total = 0;
  for (var i = 0; i < cartBoxes.length; i++) {
    var cartBox = cartBoxes[i];
    var priceElement = cartBox.getElementsByClassName("cart-price")[0];
    var quantityElement = cartBox.getElementsByClassName("cart-quantity")[0];
    var price = parseFloat(priceElement.innerText.replace("Rs.", ""));
    var quantity = quantityElement.value;
    total = total + price * quantity;
  }
  //If price contains some paise value
  total = Math.round(total * 100) / 100;
  document.getElementsByClassName("total-price")[0].innerText = "Rs." + total;
}

// Add a click event listener for the "Apply Discount" button
document
  .querySelector(".btn-discount")
  .addEventListener("click", discountButtonClicked);

// Define a variable to store the discount percentage
let discountPercentage = 0; // Initially, no discount
let discountApplied = false;
// Function to handle the discount button click
function discountButtonClicked() {
  var cartContent = document.getElementsByClassName("cart-content")[0];
  var cartBoxes = cartContent.getElementsByClassName("cart-box");
  // Check whether the cart is empty or not
  if (cartBoxes.length === 0) {
    alert("Could not apply discount,since Your cart is empty. Please Add items to your cart to apply discount.");
    return;
  }
  //Applying discount when cart is not empty
  if (discountApplied) {
    alert("Discount has already been applied.");
    return;
  } 
  // Generate a random discount percentage between 30% and 60%
  discountPercentage = Math.floor(Math.random() * 31) + 30;
  setDiscountStrategy("percentage", discountPercentage);
  discountApplied = true;
  // Apply the discount to the cart items
  updateAmountSaved();
  // //New Total
  updateNewTotal();
  
}
// Define discount strategies

class PercentageOffStrategy {
  constructor(percentage) {
    this.percentage = percentage;
  }

  applyDiscount(price) {
    return price * (1 - this.percentage / 100);
  }
}

// Context to apply the discount strategy
class DiscountContext {
  constructor(discountStrategy) {
    this.discountStrategy = discountStrategy;
  }

  setDiscountStrategy(discountStrategy) {
    this.discountStrategy = discountStrategy;
  }

  applyDiscount(price, quantity) {
    return this.discountStrategy.applyDiscount(price, quantity);
  }
}

// Initialize the discount context with a default strategy
const defaultDiscountStrategy = new PercentageOffStrategy(0); // 0% off
const discountContext = new DiscountContext(defaultDiscountStrategy);

// Function to set the discount strategy based on user input (e.g., percentage off or BOGO)
function setDiscountStrategy(strategyType, percentage = 0) {
  if (strategyType === "percentage") {
    discountContext.setDiscountStrategy(new PercentageOffStrategy(percentage));
  }
}

// Call updateTotalWithDiscount() whenever you want to update the total with the selected discount strategy.

// Function to calculate and update the amount saved
function updateAmountSaved() {
  var cartContent = document.getElementsByClassName("cart-content")[0];
  var cartBoxes = cartContent.getElementsByClassName("cart-box");
  var totalAmountSaved = 0;

  for (var i = 0; i < cartBoxes.length; i++) {
    var cartBox = cartBoxes[i];
    var priceElement = cartBox.getElementsByClassName("cart-price")[0];
    var quantityElement = cartBox.getElementsByClassName("cart-quantity")[0];
    var price = parseFloat(priceElement.innerText.replace("Rs.", ""));
    var quantity = quantityElement.value;

    // Calculate the original price without discount
    var originalPrice = price * quantity;

    // Apply the discount strategy to calculate the discounted price
    var discountedPrice = discountContext.applyDiscount(price, quantity);

    // Calculate and accumulate the amount saved for each item
    var amountSavedPerItem = originalPrice - discountedPrice;
    totalAmountSaved += amountSavedPerItem;
  }

  // Update the amount saved in the HTML
  totalAmountSaved = Math.round(totalAmountSaved * 100) / 100;
  document.getElementsByClassName("amount-saved")[0].innerText =
    "Rs." + totalAmountSaved;
}

// Initialize the amount saved
updateAmountSaved();

// Function to update the new total amount after applying a discount
function updateNewTotal() {
  var cartContent = document.getElementsByClassName("cart-content")[0];
  var cartBoxes = cartContent.getElementsByClassName("cart-box");
  var newTotal = 0;

  for (var i = 0; i < cartBoxes.length; i++) {
    var cartBox = cartBoxes[i];
    var priceElement = cartBox.getElementsByClassName("cart-price")[0];
    var quantityElement = cartBox.getElementsByClassName("cart-quantity")[0];
    var price = parseFloat(priceElement.innerText.replace("Rs.", ""));
    var quantity = quantityElement.value;

    // Apply the discount strategy to calculate the discounted price
    var discountedPrice = discountContext.applyDiscount(price, quantity);

    // Calculate and accumulate the new total after applying the discount
    newTotal += discountedPrice;
  }

  // Update the new total in the HTML
  newTotal = Math.round(newTotal * 100) / 100;
  document.getElementsByClassName("new-total-price")[0].innerText =
    "Rs." + newTotal;
}

// Function to handle scenarios when the cart is empty or after an order has been placed
function handleEmptyCartAndOrderPlaced() {
  var cartContent = document.getElementsByClassName("cart-content")[0];
  var cartBoxes = cartContent.getElementsByClassName("cart-box");
  var newTotal = 0; // Initialize the new total to zero

  // If the cart is empty, display a message and set the new total to zero
  if (cartBoxes.length === 0) {
    document.getElementsByClassName("new-total-price")[0].innerText = "Rs.0";
    document.getElementsByClassName("amount-saved")[0].innerText = "Rs.0";
    return; // Exit the function
  }

  // Update the new total after applying the discount
  updateNewTotal();
  updateAmountSaved();
}
