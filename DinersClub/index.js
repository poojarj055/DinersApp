import { menuArray } from "./data.js";

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
          <img src="plus_icon.png" alt="Add item" width="50px" height="=50px" data-productID=${foodelement.id} >
        </a>
      </div>
    </div>`;
  });

  return renderItemHtml;
}

// Function to load menu items initially and when "Order More" button is clicked
function loadMenuItems() {
  const containerWrapper = document.querySelector(".container-wrapper");
  containerWrapper.innerHTML = getPropertyHtml();
  containerWrapper.style.display = "block"; 
  }

  function removeMenuItems() {
    const containerWrapper = document.querySelector(".container-wrapper");
    containerWrapper.style.display = "none";
    }

// const containerWrapper = document.querySelector(".container-wrapper");
document.addEventListener("DOMContentLoaded", function () {
  loadMenuItems();
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
//  const containerWrapper = document.querySelector(".container-wrapper");
  const containerWrapperPlus = document.querySelector(".container-wrapper-plus");

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
      // Code for adding items
      const index = parseInt(target.dataset.productid, 10);
      const selectedItem = menuArray.find((item) => item.id === index);

        const notificationArea = document.getElementById("notificationArea");
    notificationArea.textContent = `${selectedItem.name} Added to cart`;
    notificationArea.style.display = "block";

    // Hide notification message after 2 seconds
    setTimeout(() => {
      notificationArea.style.display = "none";
    }, 1000);

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
        const minusIconExists = deleteItemsList.querySelector(`img[data-itemid="${selectedItem.id}"]`);
      if (!minusIconExists) {
        const minusIcon = document.createElement("img");
        minusIcon.src = "icons8-remove.png";
        minusIcon.width = "25";
        minusIcon.height = "22";
        minusIcon.alt = "Minus";
        minusIcon.style.padding = '2px';
        minusIcon.style.display = "flex";
        minusIcon.classList.add("minus-icon");
        minusIcon.classList.add("hover-effect"); // Add hover effect class
        deleteItemsList.appendChild(minusIcon);
        minusIcon.dataset.itemId = selectedItem.id;
      }
      const listItemPrice = document.createElement("li");
        listItemPrice.textContent = `$${selectedItem.price * quantity}`;
        listItemPrice.dataset.id = selectedItem.id;
        selectedItemsListPrice.appendChild(listItemPrice);
      }

      updateTotalAmount();

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
  e.preventDefault();

  // Get form input values
  const name = orderDetailsForm.elements["name"].value;
  const phone = orderDetailsForm.elements["phone"].value;
  const tableNo = orderDetailsForm.elements["tableNo"].value;
  console.log(name, phone, tableNo);

  // Check if all field is valid
  if (phone && name && tableNo) {
    const orderId = Math.floor(Math.random() * 10000) + 1;

    // Create order confirmation HTML
    const orderDetails = document.createElement("div");
    orderDetails.innerHTML = `
      <div class="OrderConfirm">
        <h1>Your order is confirmed! Order id: #${orderId}</h1>
        <h2 class="orderDescription">Hey <b>${name}, </b> <br>
        Your Food will be reached at Table Number: <b>${tableNo}</b> soon! <br>
        We may call at: <b>${phone}</b> if any query </h2>
        <h1>Thank you for your order! <img src="cute-food.gif" class="motorbike" height="55px" width="55px" /></h1>
        <button class="orderMore-btn">Order More!</button>
      </div>`;
       // Append order confirmation to body
      document.body.appendChild(orderDetails);
    // Add event listener for "Order More" button inside order confirmation
    const orderMore = orderDetails.querySelector(".orderMore-btn");
    orderMore.addEventListener("click", function () {
      orderDetails.remove(); // Remove order confirmation section
      orderSummary.style.display = "none"; // Hide order summary again
      completeOrderButton.style.display = "none"; // Hide complete order button again
      selectedItemsListName.innerHTML = ""; // Clear selected items list
      selectedItemsListPrice.innerHTML = "";
      selectedItemsListTotalPrice.textContent = "Total: $0";
      loadMenuItems(); // Reload menu items
      //completeOrderButton.add();
      if(completeOrderButton.style.display == "none") {
        completeOrderButton.style.display = "inline-block"; 
      }
  });
    // Reset form and hide modal
    orderDetailsForm.reset();
    closeModal();
    removeMenuItems();
    //completeOrderButton.remove(); 
    completeOrderButton.style.display = "none";
    const minusIcons = document.querySelectorAll('.minus-icon');
    minusIcons.forEach((icon) => {
      icon.remove();
    });
    // const selectedItemsList=document.getElementById("selectedItemsList");
    // selectedItemsList.style.width= '50%';
    // selectedItemsList.style.margin= 'auto';
   
  } else {
    // Display error message
    const errorMessage = document.createElement("div");
    errorMessage.textContent = "Please provide all the details correctly to receive the order at your table.";
    errorMessage.style.color = "red";
    orderForm.appendChild(errorMessage);
  }
});

  // Event listener to hide form and overlay on overlay click
  overlay.addEventListener("click", closeModal);
  //   orderForm.classList.add('hidden');
  //   overlay.classList.add('hidden');
  //   // orderForm.style.display = "none";
  //   // overlay.style.display = "none";
  // });
  document.querySelector(".btn--close-modal").addEventListener("click",closeModal);
    // //  orderForm.style.display = "none";
    // // overlay.style.display = "none";
    // orderForm.classList.add('hidden');
    // overlay.classList.add('hidden');
});

