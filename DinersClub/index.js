import { menuArray } from "./data.js";

document.addEventListener("DOMContentLoaded", function () {
  const selectedItemsListName = document.getElementById("name");
  const selectedItemsListPrice = document.getElementById("price");
  const selectedItemsListTotalPrice = document.querySelector(".totalAmount");
  const deleteItemsList = document.getElementById("minus"); // Changed to querySelector
  const orderSummary = document.querySelector(".orderSummary");
  const completeOrderButton = document.querySelector(".complete-btn");
  const orderForm = document.querySelector(".orderForm");
  const overlay = document.querySelector(".overlay");
  const orderDetailsForm = document.getElementById("orderDetailsForm");
  const submitorder = document.querySelector(".submit-btn");
  let totalAmountSummary = 0;
  const containerWrapper = document.querySelector(".container-wrapper");
  const containerWrapperPlus = document.querySelector(".container-wrapper-plus");


  // Function to create HTML for each menu item
  function getPropertyHtml() {
    let renderItemHtml = "";

    menuArray.forEach((foodelement) => {
      renderItemHtml += `<div class="container">
        <div class="section1">${foodelement.emoji}</div>  
        <div class="section2">
          <section id="cart-item">
            <div>
              <h1>${foodelement.name}</h1>
              <h2 class="food_description">${foodelement.ingredients}</h2>
              <h2>$${foodelement.price}</h2>
            </div>
          </section>
        </div>
        <div class="section3"> 
          <a href="#">
            <img src="plus_icon.png" alt="Add item" width="50px" height="=50px" data-productID=${foodelement.id}>
          </a>
        </div>
      </div>`;
    });

    return renderItemHtml;
  }

  // Set HTML for menu items
  document.querySelector(".container-wrapper").innerHTML = getPropertyHtml();

  // Event listener for clicks
  document.addEventListener("click", function (e) {
    e.preventDefault();
    const target = e.target;

    // Decrease quantity or remove item if minus icon is clicked
    if (target.classList.contains("minus-icon")) {
      const listItem = target.parentElement.parentElement;
      const itemId = e.target.dataset.itemId; // Corrected to use listItem.dataset.itemId
      const nameElement = document.querySelector(`#name [data-id="${itemId}"]`);
      const priceElement = document.querySelector(`#price [data-id="${itemId}"]`);

      if (nameElement && priceElement) {
        let quantity = parseInt(nameElement.dataset.quantity, 10);
        if (quantity > 1) {
          quantity -= 1; // Decrease quantity by 1
          nameElement.textContent = `${menuArray.find((item) => item.id === parseInt(itemId, 10)).name} x${quantity}`;
          nameElement.dataset.quantity = quantity;
          priceElement.textContent = `$${menuArray.find((item) => item.id === parseInt(itemId, 10)).price * quantity}`;
        } else {
          // Remove the item if quantity becomes 0
        //  listItem.remove();
          nameElement.remove();
          priceElement.remove();
          target.remove(); // Remove the minus icon
        }

        // Update total amount based on visible items in order summary
        updateTotalAmount();
      }
      if (selectedItemsListName.children.length === 0) {
        // Hide order summary and reset total amount
        orderSummary.style.display = "none";
        selectedItemsListTotalPrice.textContent = "Total: $0";
        totalAmountSummary = 0;
      }
    }

    if (target.dataset.productid) {
      // Code for adding items (same as before)
      const index = parseInt(target.dataset.productid, 10);
      const selectedItem = menuArray.find((item) => item.id === index);

      // Calculate quantity dynamically
      let quantity = 1; // Default quantity
      const existingItem = selectedItemsListName.querySelector(`li[data-id="${selectedItem.id}"]`);
      if (existingItem) {
        quantity = parseInt(existingItem.dataset.quantity, 10) + 1;
        existingItem.textContent = `${selectedItem.name} x${quantity}`; // Update existing item text
        existingItem.dataset.quantity = quantity;

        // Update the total price for the existing item
        const totalPrice = selectedItem.price * quantity;
        const existingPriceElement = selectedItemsListPrice.querySelector(`li[data-id="${selectedItem.id}"]`);
        existingPriceElement.textContent = `$${totalPrice}`;
      } else {
        const listItemName = document.createElement("li");
        listItemName.textContent = `${selectedItem.name} x${quantity}`;
        listItemName.dataset.id = selectedItem.id;
        listItemName.dataset.quantity = quantity;
        selectedItemsListName.appendChild(listItemName);

        // Create and append the minus icon
        const minusIcon = document.createElement("img");
        minusIcon.src = "icons8-remove.png";
        minusIcon.width = "25";
        minusIcon.height = "22";
        minusIcon.alt = "Minus";
        minusIcon.style.padding = '3px';
        minusIcon.style.display = "flex";
        minusIcon.classList.add("minus-icon");
        minusIcon.classList.add("hover-effect"); // Add hover effect class
        deleteItemsList.appendChild(minusIcon);

        minusIcon.dataset.itemId = selectedItem.id;
        const listItemPrice = document.createElement("li");
        listItemPrice.textContent = `$${selectedItem.price * quantity}`;
        listItemPrice.dataset.id = selectedItem.id; // Associate price element with item
        selectedItemsListPrice.appendChild(listItemPrice);
      }

      // Update the total amount based on quantity and price
      updateTotalAmount();

      // Show the order summary
      orderSummary.style.display = "block";
    }
  });

  // Function to update the total amount based on visible items in order summary
  function updateTotalAmount() {
    totalAmountSummary = 0;
    selectedItemsListPrice.querySelectorAll("li").forEach((item) => {
      totalAmountSummary += parseFloat(item.textContent.replace("$", ""));
    });
    selectedItemsListTotalPrice.textContent = `Total: $${totalAmountSummary}`;
    if (selectedItemsListName.children.length === 0) {
      orderSummary.style.display = "none";
    }
  }

  // Function to add HTML for order summary
  function additem() {
    const additemHTML = `<div class="orderSummary" style="display:none;">
      <h2>Your Order Summary:</h2>
      <ul id="selectedItemsList">
        <ul id="name"></ul>
        <ul id="price"></ul>
        <ul id="minus"></ul>
      </ul>
      <p class="totalAmount">Total: $0</p>
      <button class="complete-btn">Complete Order</button>
    </div>`;
    return additemHTML;
  }

  // Insert order summary HTML
  document.querySelector(".container-wrapper").insertAdjacentHTML("beforeend", additem());
  if (selectedItemsListName.children.length > 0) {
    orderSummary.style.display = "block";
  }

  const openModal = function (e) {
    e.preventDefault();
    orderForm.classList.remove('hidden');
    overlay.classList.remove('hidden');
  };
  
  const closeModal = function () {
    orderForm.classList.add('hidden');
    overlay.classList.add('hidden');
  };

  // Event listener for complete order button
 completeOrderButton.addEventListener('click',openModal);

    submitorder.addEventListener("click", function (e) {
   // e.preventDefault();
    console.log("orderDetailsForm");
    
    // Get form input values
    const name = orderDetailsForm.elements["name"].value;
    const phone = orderDetailsForm.elements["phone"].value;
    const tableNo = orderDetailsForm.elements["tableNo"].value;
    console.log(name, phone, tableNo);
    // Update HTML body with form details
    
    if(phone){
    const orderDetails = document.createElement("div");
    orderDetails.innerHTML = `
    <div class="OrderConfirm">
    
      <h1>Your order is confirmed! </h1>
      <h2>Hey <b>${name}, </b> <br>
      Your Food will be reached at Table Number: <b> ${tableNo} </b> soon! <br>
      We may call at: <b> ${phone} </b> if any query </h2>
      <h1>Thank you for your order! <img src="cute-food.gif" class ="motorbike" height="50px" width="50px" /></h1>
      </div>
    `;
  //  orderDetails.style.display = "flex";
    document.body.appendChild(orderDetails);
  


    // Reset form and hide modal
    orderDetailsForm.reset();
    orderForm.classList.add('hidden');
    overlay.classList.add('hidden');
    containerWrapper.remove();
    completeOrderButton.remove();
    deleteItemsList.remove();
   // containerWrapperPlus.remove();
   // containerWrapperPlus.remove();
    }
    else{
      alert("please enter valid phone number");
    }
  });


  // Event listener to hide form and overlay on overlay click
  overlay.addEventListener("click", function () {
    orderForm.style.display = "none";
    overlay.style.display = "none";
  });
  document.querySelector(".btn--close-modal").addEventListener("click", function () {
    //  orderForm.style.display = "none";
    // overlay.style.display = "none";
    orderForm.classList.add('hidden');
    overlay.classList.add('hidden');
  });
});

