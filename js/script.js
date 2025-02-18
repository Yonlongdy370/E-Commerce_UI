console.log('Rendering PayPal button...');

    let cartItems = document.getElementById("cartItems");
    let checkoutItems = document.getElementById("checkoutItems");
    let cartCount = document.getElementById("cartCount");
    let freeCheckoutButton = document.getElementById("freeCheckoutButton");
    let totalPriceElement = document.getElementById('totalPrice');
    let checkoutModal = document.getElementById("checkoutModal");
    let totalAmount = parseFloat(document.getElementById('total-amount').textContent).toFixed(2);

    let cartDisplay = document.getElementById("cart-display");
    let cart = [];
    // Add item to cart
    function addToCart(productId, productName, productPrice) {
        const product = { id: productId, name: productName, price: productPrice, quantity: 1 };
        const existingProductIndex = cart.findIndex(item => item.id === productId);

        if (existingProductIndex >= 0) {
            cart[existingProductIndex].quantity += 1;
        } else {
            cart.push(product);
        }
        alert(productName + ' has been added to your cart');
        updateCartDisplay();
    }


    function buyNow(productId, productName, productPrice) {
        // Optionally, add the item to the cart (if you still want the item in the cart)
        addToCart(productId, productName, productPrice);
    
        // Immediately display the PayPal button
        const paypalContainer = document.getElementById('paypal-button-container');
        paypalContainer.style.display = 'block';
    
        // Initialize and render the PayPal button
        renderPaypalButton(productPrice); // Pass productPrice directly for PayPal payment
    }

    




    // Update cart display
    function updateCartDisplay() {
        let cartContent = document.getElementById("cart-content");
        cartContent.innerHTML = '';

        let totalAmount = 0;
        cart.forEach(item => {
            let row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.name}</td>
                <td>$${item.price}</td>
                <td>
                    <button onclick="changeQuantity(${item.id}, -1)" class="btn btn-sm btn-danger">-</button>
                    ${item.quantity}
                    <button onclick="changeQuantity(${item.id}, 1)" class="btn btn-sm btn-success">+</button>
                </td>
                <td>$${(item.price * item.quantity).toFixed(2)}</td>
                <td><button onclick="removeFromCart(${item.id})" class="btn btn-sm btn-warning">Remove</button></td>
            `;
            cartContent.appendChild(row);
            totalAmount += item.price * item.quantity;
        });

        document.getElementById("total-amount").innerText = totalAmount.toFixed(2);
        document.getElementById("cart-count").innerText = cart.length;

        // Toggle PayPal button visibility
        const paypalContainer = document.getElementById('paypal-button-container');
        if (cart.length === 0) {
            paypalContainer.style.display = 'none';
        } else {
            paypalContainer.style.display = 'block';
            renderPaypalButton(); // Render PayPal button when items are in the cart
        }
    }

    // Change quantity of item in the cart
    function changeQuantity(productId, delta) {
        const product = cart.find(item => item.id === productId);
        if (product) {
            product.quantity += delta;
            if (product.quantity < 1) {
                product.quantity = 1; // Prevent quantity from going below 1
            }
            updateCartDisplay(); // Update the cart display after changing quantity
        }
    }

    // Remove item from cart
    function removeFromCart(productId) {
        cart = cart.filter(item => item.id !== productId);
        updateCartDisplay();
    }



// Proceed to checkout
function checkout() {
    if (cart.length === 0) {
        alert("Your cart is empty.");
        return;
    }

    // Replace the alert with generateInvoice call
    const buyerName = prompt("Enter the buyer's name:", ) || "Buyer";
    generateInvoice(buyerName, cart);
    
}




    // Toggle the cart modal visibility
    function showCart() {
        cartDisplay.style.display = cartDisplay.style.display === 'block' ? 'none' : 'block';
    }

    // Close the cart modal
    function exit() {
        cartDisplay.style.display = 'none'; // Close the cart modal
    }


// Render PayPal Button
function renderPaypalButton() {
    const paypalButtonContainer = document.getElementById('paypal-button-container');
    const totalAmount = parseFloat(document.getElementById('total-amount').textContent).toFixed(2);

    // Prevent rendering if the button already exists
    if (paypalButtonContainer.childElementCount > 0) {
        console.log('PayPal button already rendered.');
        return;
    }

    // Create and render PayPal button
    paypal.Buttons({
        createOrder: function (data, actions) {
            return actions.order.create({
                purchase_units: [{
                    amount: { value: totalAmount }
                }]
            });
        },
        onApprove: function (data, actions) {
            return actions.order.capture().then(function (details) {
                const payerName = details.payer.name.given_name;
                alert(`Thanks you The operation was successfully completed​ : ${payerName}.`);
                const invoice = generateInvoice(payerName, cart);
                console.log('Generated Invoice:', invoice); // Log invoice details (or use elsewhere)
                
                // Clear cart and update display after successful payment
                cart = [];
                updateCartDisplay();
                return invoice; // Return the invoice
            });
        },
        onError: function (err) {
            console.error('PayPal button error:', err);
            alert('There was an error processing your payment. Please try again.');
        }
    }).render(paypalButtonContainer);
}

// add

// Helper function to format the item details
function formatItemDetails(item) {
    const itemTotal = item.price * item.quantity;
    return ` - ${item.name}: $${item.price} x ${item.quantity} = $${itemTotal.toFixed(2)}`;
}

// Helper function to generate the current date in a readable format
function getCurrentDate() {
    const today = new Date();
    return today.toLocaleDateString(); // Format: MM/DD/YYYY
}

// Helper function to generate a random invoice number
function generateInvoiceNumber() {
    return `INV-${Math.floor(Math.random() * 1000000)}`; // Random number for invoice ID
}

// Helper function to get a default payment method
function getDefaultPaymentMethod() {
    return 'Credit Card'; // You can change this default or make it dynamic based on user input
}


// Invoice
function generateInvoice(buyerName, cart) {
    const invoiceNumber = generateInvoiceNumber();
    const invoiceDate = getCurrentDate();
    const paymentMethod = getDefaultPaymentMethod();

    // Start the HTML layout
    let invoiceDetails = `
    <div style="display: flex; justify-content: center; align-items: center; height: 100vh; background: linear-gradient(135deg, #f6f4f4, #f6f4f4);">
        <div style="width: 80%; max-width: 800px; padding: 20px; border-radius: 10px; background-color: #fff; box-shadow: 0 4px 8px rgba(37, 36, 35, 0.1);">
            <h2 style="text-align: center; font-family: 'Arial', sans-serif; color: #d72d13;">Invoice</h2>
            <p style="font-size: 16px; color: #333333;"><strong>Invoice Number:</strong> ${invoiceNumber}</p>
            <p style="font-size: 16px; color: #333333;"><strong>Date:</strong> ${invoiceDate}</p>
            <p style="font-size: 16px; color: #333333;"><strong>Buyer:</strong> ${buyerName}</p>
            <p style="font-size: 16px; color: #333333;"><strong>Payment Method:</strong> ${paymentMethod}</p>
            
            <h3 style="text-align: center; color: #d72d13; margin-top: 20px;">Items:</h3>
            <table style="width: 100%; margin-top: 20px; border-collapse: collapse; border: 1px solid #ddd;">
                <thead>
                    <tr style="background-color: #d72d13; color: white; text-align: left;">
                        <th style="padding: 12px; font-weight: bold; border-right: 1px solid #ffffff;">Item Name</th>
                        <th style="padding: 12px; font-weight: bold; text-align: center; border-right: 1px solid #ffffff;">Price</th>
                        <th style="padding: 12px; font-weight: bold; text-align: center; border-right: 1px solid #ffffff;">Quantity</th>
                        <th style="padding: 12px; font-weight: bold; text-align: right;">Total</th>
                    </tr>
                </thead>
                <tbody>`;

    let totalAmount = 0;

    // Loop through the cart and add items to the table
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        totalAmount += itemTotal;
        invoiceDetails += `
            <tr style="background-color: #f6f4f4; border-bottom: 1px solid #e7e4e4;">
                <td style="padding: 12px; color: #333; border-right: 1px solid #e7e4e4;">${item.name}</td>
                <td style="padding: 12px; text-align: center; color: #333333; border-right: 1px solid #e7e4e4;">$${item.price.toFixed(2)}</td>
                <td style="padding: 12px; text-align: center; color: #333333; border-right: 1px solid #e7e4e4;">${item.quantity}</td>
                <td style="padding: 12px; text-align: right; color: #333333;">$${itemTotal.toFixed(2)}</td>
            </tr>`;
    });

    // Add the total row and the thank-you note
    invoiceDetails += `
                </tbody>
                <tfoot>
                    <tr style="background-color: #d72d13; color: white;">
                        <td colspan="3" style="text-align: right; font-weight: bold; padding: 12px;">Total:</td>
                        <td style="text-align: right; font-weight: bold; padding: 12px;">$${totalAmount.toFixed(2)}</td>
                    </tr>
                </tfoot>
            </table>

            <p style="margin-top: 20px; text-align: center; font-size: 15px; font-weight: bold; color: #1abe14;">Thank you for your purchase! <br> We wish our customers good health and good luck.</p>
            
            <!-- Exit Button with Gradient -->
            <div style="text-align: center; margin-top: 30px;">
                <button onclick="handleExit()" style="padding: 12px 25px; font-size: 16px; background: #d72d13; color: white; border: none; border-radius: 5px; cursor: pointer; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">Exit</button>
            </div>
        </div>
    </div>`;

    // Display the invoice to the user inside a container
    document.body.innerHTML = invoiceDetails;

    return invoiceDetails;
}



// Handle exit logic
function handleExit() {
    // Check if the page is opened as a pop-up
    if (window.opener) {
        // Close the pop-up window if it was opened using window.open()
        window.close();
    } else {
        // Redirect to the homepage (or any other page) when on the main window
        window.location.href = '/'; // Replace '/' with the URL of your home page or another page
    }
}










// /--/

    function filterProducts() {
  const filterValue = document.getElementById('filterProduct').value;
  const rows = document.querySelectorAll('#checkoutItems tr');
  
  rows.forEach((row) => {
    const productCategory = row.getAttribute('data-category'); // Example: 'men' or 'women'
    if (filterValue === 'all' || productCategory === filterValue) {
      row.style.display = '';
    } else {
      row.style.display = 'none';
    }
  });
}

function filterByPrice() {
  const priceFilter = document.getElementById('priceRange').value;
  const rows = document.querySelectorAll('#checkoutItems tr');
  
  rows.forEach((row) => {
    const price = parseFloat(row.getAttribute('data-price'));
    let display = false;

    if (priceFilter === 'all') display = true;
    else if (priceFilter === 'low' && price < 50) display = true;
    else if (priceFilter === 'medium' && price >= 50 && price <= 100) display = true;
    else if (priceFilter === 'high' && price > 100) display = true;

    row.style.display = display ? '' : 'none';
  });
}


// new
// function openProduct(id, name, price, category, image) {
//     // Set the modal product details dynamically
//     document.getElementById("modalProductTitle").innerText = name;
//     document.getElementById("modalProductImage").src = image;
//     document.getElementById("modalProductDescription").innerText = `This product is a high-quality ${name.toLowerCase()} that fits your needs perfectly.`;
//     document.getElementById("modalProductCategory").innerText = `Category: ${category}`;
//     document.getElementById("modalProductPrice").innerText = `$${price.toFixed(2)}`;
  
//     // Show the modal
//     const modal = new bootstrap.Modal(document.getElementById("productModal"));
//     modal.show();
//   }
  
console.log('Rendering PayPal button...');


let modalProductId = null; // To keep track of the current product in the modal
let modalProductPrice = 0; // To store the current product's price
let modalProductName = ""; // To store the current product's name
let modalProductQuantity = 1; // Default quantity

// Add item to cart
function addToCart(productId, productName, productPrice) {
    const product = { id: productId, name: productName, price: productPrice, quantity: 1 };
    const existingProductIndex = cart.findIndex(item => item.id === productId);

    if (existingProductIndex >= 0) {
        cart[existingProductIndex].quantity += 1;
    } else {
        cart.push(product);
    }
    alert(productName + ' has been added to your cart');
    updateCartDisplay();
}

// Function to open product details in the modal
function openProduct(id, name, price, category, image) {
    modalProductId = id;
    modalProductName = name;
    modalProductPrice = price;
    modalProductQuantity = 1; // Reset quantity when opening a new product
    
    // Set the modal product details dynamically
    document.getElementById("modalProductTitle").innerText = name;
    document.getElementById("modalProductImage").src = image;
    document.getElementById("modalProductDescription").innerText = `This product is a high-quality ${name.toLowerCase()} that fits your needs perfectly.`;
    document.getElementById("modalProductCategory").innerText = `Category: ${category}`;
    document.getElementById("modalProductPrice").innerText = `$${price.toFixed(2)}`;
  
    // Show the modal
    const modal = new bootstrap.Modal(document.getElementById("productModal"));
    modal.show();
}

// Function to increase quantity in the modal
function increaseQuantity() {
    modalProductQuantity++;
    updateQuantityDisplay();
}

// Function to decrease quantity in the modal
function decreaseQuantity() {
    if (modalProductQuantity > 1) {
        modalProductQuantity--;
    }
    updateQuantityDisplay();
}

// Update quantity display in the modal
function updateQuantityDisplay() {
    document.getElementById("quantity").innerText = modalProductQuantity;
}

// Add the product from modal to cart
function addToCartModal() {
    const product = { id: modalProductId, name: modalProductName, price: modalProductPrice, quantity: modalProductQuantity };
    const existingProductIndex = cart.findIndex(item => item.id === modalProductId);

    if (existingProductIndex >= 0) {
        cart[existingProductIndex].quantity += modalProductQuantity;
    } else {
        cart.push(product);
    }

    alert(`${modalProductName} has been added to your cart`);
    updateCartDisplay();
    const modal = bootstrap.Modal.getInstance(document.getElementById("productModal"));
    modal.hide(); // Close the modal after adding to cart
}

// Update cart display with the items
function updateCartDisplay() {
    let cartContent = document.getElementById("cart-content");
    cartContent.innerHTML = '';

    let totalAmount = 0;
    cart.forEach(item => {
        let row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td>$${item.price}</td>
            <td>
                <button onclick="changeQuantity(${item.id}, -1)" class="btn btn-sm btn-danger">-</button>
                ${item.quantity}
                <button onclick="changeQuantity(${item.id}, 1)" class="btn btn-sm btn-success">+</button>
            </td>
            <td>$${(item.price * item.quantity).toFixed(2)}</td>
            <td><button onclick="removeFromCart(${item.id})" class="btn btn-sm btn-warning">Remove</button></td>
        `;
        cartContent.appendChild(row);
        totalAmount += item.price * item.quantity;
    });

    document.getElementById("total-amount").innerText = totalAmount.toFixed(2);
    document.getElementById("cart-count").innerText = cart.length;

    // Toggle PayPal button visibility
    const paypalContainer = document.getElementById('paypal-button-container');
    if (cart.length === 0) {
        paypalContainer.style.display = 'none';
    } else {
        paypalContainer.style.display = 'block';
        renderPaypalButton(); // Render PayPal button when items are in the cart
    }
}

// Change quantity of item in the cart
function changeQuantity(productId, delta) {
    const product = cart.find(item => item.id === productId);
    if (product) {
        product.quantity += delta;
        if (product.quantity < 1) {
            product.quantity = 1; // Prevent quantity from going below 1
        }
        updateCartDisplay(); // Update the cart display after changing quantity
    }
}

// Remove item from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartDisplay();
}

// Render PayPal Button
function renderPaypalButton() {
    const paypalButtonContainer = document.getElementById('paypal-button-container');
    const totalAmount = parseFloat(document.getElementById('total-amount').textContent).toFixed(2);

    // Prevent rendering if the button already exists
    if (paypalButtonContainer.childElementCount > 0) {
        console.log('PayPal button already rendered.');
        return;
    }

    // Create and render PayPal button
    paypal.Buttons({
        createOrder: function (data, actions) {
            return actions.order.create({
                purchase_units: [{
                    amount: { value: totalAmount }
                }]
            });
        },
        onApprove: function (data, actions) {
            return actions.order.capture().then(function (details) {
                const payerName = details.payer.name.given_name;
                alert(`The operation was successfully completed​ : ${payerName}.`);
                const invoice = generateInvoice(payerName, cart);
                console.log('Generated Invoice:', invoice); // Log invoice details (or use elsewhere)
                
                // Clear cart and update display after successful payment
                cart = [];
                updateCartDisplay();
                return invoice; // Return the invoice
            });
        },
        onError: function (err) {
            console.error('PayPal button error:', err);
            alert('There was an error processing your payment. Please try again.');
        }
    }).render(paypalButtonContainer);
}

// Helper functions for generating invoices can be used here as well...

var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Function to animate image on mouseover
    function animateImage() {
        const image = document.getElementById('modalProductImage');
        image.classList.add('animate__animated', 'animate__pulse', 'animate__infinite');
    }

    // Function to reset image animation on mouseout
    function resetImage() {
        const image = document.getElementById('modalProductImage');
        image.classList.remove('animate__animated', 'animate__pulse', 'animate__infinite');
    }


    


    


    document.querySelectorAll('.box').forEach(box => {
        box.addEventListener('click', () => {
          // Add a class for the active animation
          box.classList.add('active-animation');
          
          // Remove the class after animation ends
          setTimeout(() => box.classList.remove('active-animation'), 400);
        });
      });
      




