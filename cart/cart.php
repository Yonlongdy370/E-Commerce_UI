<!-- Cart Modal -->
<div 
  id="cart-display" 
  class="cart-display position-fixed top-40 end-0 p-4 bg-white shadow-lg rounded animate__animated animate__fadeIn"
  style="max-width: 500px; width: 90%; display: none; z-index: 1000; overflow: auto; border: 2px solid black; top: 10%;"
>
  <h4 class="text-center mb-4" style="color: black;">Your Cart</h4>
  <table class="table table-striped table-bordered" style="border-color: black;">
    <thead>
      <tr style="background-color: red; color: white;">
        <th>Product</th>
        <th>Price</th>
        <th>Quantity</th>
        <th>Total</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody id="cart-content" style="color: black;"></tbody>
  </table>
  <div class="d-flex justify-content-between align-items-center mb-3">
    <strong>Total: $<span id="total-amount" style="color: red;">0</span></strong>
  </div>
  <div id="paypal-button-container" style="display: none;"></div>
  <div class="btn-box text-center">
    <button class="btn" style="background-color: red; color: white; border: none;" onclick="checkout()">
      Checkout
    </button>
    <button class="btn" style="background-color: black; color: white; border: none;" onclick="exit()">
      Exit
    </button>
  </div>
</div>