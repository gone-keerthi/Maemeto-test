document.addEventListener("DOMContentLoaded", function () {
  // Fetch product data from the API
  fetch(
    "https://cdn.shopify.com/s/files/1/0564/3685/0790/files/singleProduct.json"
  )
    .then((response) => response.json())
    .then((data) => {
      const product = data.product;

      const productImages = [
        "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
        "https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg",
        "https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_.jpg",
        "https://fakestoreapi.com/img/61sbMiUnoGL._AC_UL640_QL65_ML3_.jpg",
      ];

      const mainProductImage = document.getElementById("main-product-image");
      const thumbnailImagesContainer =
        document.getElementById("thumbnail-images");

      // Display main product image
      mainProductImage.src = productImages[0];

      // Display thumbnail images
      productImages.forEach((imageSrc, index) => {
        const thumbnailImage = document.createElement("img");
        thumbnailImage.src = imageSrc;
        thumbnailImage.alt = "Thumbnail Image " + (index + 1);
        thumbnailImage.classList.add("thumbnail-image");
        thumbnailImagesContainer.appendChild(thumbnailImage);

        // Add click event listener to thumbnail images
        thumbnailImage.addEventListener("click", function () {
          mainProductImage.src = imageSrc;
        });
      });

      // Display product details
      document.getElementById("product-title").textContent = product.title;
      document.getElementById("product-vendor").textContent = product.vendor;
      document.getElementById("product-price").textContent = product.price;
      document.getElementById("compare-at-price").textContent =
        product.compare_at_price;

      // Calculate and display percentage discount
      const price = parseFloat(product.price.replace("$", "").replace(",", ""));
      const compareAtPrice = parseFloat(
        product.compare_at_price.replace("$", "").replace(",", "")
      );
      const percentageDiscount =
        ((compareAtPrice - price) / compareAtPrice) * 100;
      document.getElementById("percentage-discount").textContent =
        percentageDiscount.toFixed(2) + "%";

      // Display product description
      document.getElementById("product-description").innerHTML =
        product.description;

      // Display color options as checkboxes
      const colorSelector = document.getElementById("color-selector");
      product.options
        .find((option) => option.name === "Color")
        .values.forEach((color) => {
          const colorName = Object.keys(color)[0];
          const colorValue = color[colorName];
          const label = document.createElement("label");
          label.className = "color-checkbox";
          const checkbox = document.createElement("input");
          checkbox.type = "checkbox";
          checkbox.name = "color";
          checkbox.value = colorValue; // Assign color value to the checkbox
          label.appendChild(checkbox);
          label.innerHTML += `<span>${colorName}</span>`; // Display color name next to checkbox
          colorSelector.appendChild(label);
        });

      // Add event listener to allow only one checkbox to be checked
      const checkboxes = document.querySelectorAll(
        'input[type="checkbox"][name="color"]'
      );
      checkboxes.forEach((checkbox) => {
        checkbox.addEventListener("change", function () {
          checkboxes.forEach((otherCheckbox) => {
            if (otherCheckbox !== checkbox) {
              otherCheckbox.checked = false;
            }
          });
        });
      });

      //Display size options
      const sizeSelector = document.getElementById("size-selector");

      // Function to handle radio button selection
      function handleSizeSelection(event) {
        const selectedSize = event.target.value;
        const labels = document.querySelectorAll("#size-selector label");

        // Reset styles for all labels
        labels.forEach((label) => {
          label.classList.remove("selected");
        });

        // Apply style to the selected label
        const selectedLabel = document.querySelector(
          `#size-selector label[data-size="${selectedSize}"]`
        );
        if (selectedLabel) {
          selectedLabel.classList.add("selected");
        }
      }

      // Add event listener to each radio button
      product.options
        .find((option) => option.name === "Size")
        .values.forEach((size) => {
          const label = document.createElement("label");
          const radio = document.createElement("input");
          radio.type = "radio";
          radio.name = "size";
          radio.value = size;
          label.dataset.size = size; // Add data attribute to identify the size
          radio.addEventListener("change", handleSizeSelection);
          label.appendChild(radio);
          label.appendChild(document.createTextNode(size));
          sizeSelector.appendChild(label);
        });

      // Event listener for Add to Cart button
      document
        .getElementById("add-to-cart-btn")
        .addEventListener("click", function () {
          const selectedColorCheckbox = document.querySelector(
            'input[name="color"]:checked'
          );
          const selectedColorLabel = selectedColorCheckbox
            ? selectedColorCheckbox.parentElement
            : null;
          const selectedColorName = selectedColorLabel
            ? selectedColorLabel.textContent.trim()
            : "";
          const selectedSizeRadio = document.querySelector(
            'input[name="size"]:checked'
          );
          const selectedSizeValue = selectedSizeRadio
            ? selectedSizeRadio.value
            : "";
          const selectedQuantity =
            document.getElementById("quantity-selector").value;
          const message = `Added ${product.title} (${selectedColorName}, ${selectedSizeValue})  to cart.`;
          document.getElementById("add-to-cart-message").textContent = message;
        });

      // Get quantity elements
      const quantity = document.getElementById("quantity");
      const decreaseButton = document.getElementById("decrease-quantity");
      const increaseButton = document.getElementById("increase-quantity");

      // Set initial quantity value
      let currentQuantity = 1;

      // Update quantity display
      function updateQuantityDisplay() {
        quantity.textContent = currentQuantity;
      }

      // Decrease quantity function
      function decreaseQuantity() {
        if (currentQuantity > 1) {
          currentQuantity--;
          updateQuantityDisplay();
        }
      }

      // Increase quantity function
      function increaseQuantity() {
        currentQuantity++;
        updateQuantityDisplay();
      }

      // Add event listeners to buttons
      decreaseButton.addEventListener("click", decreaseQuantity);
      increaseButton.addEventListener("click", increaseQuantity);
    })
    .catch((error) => {
      console.error("Error fetching product data:", error);
    });
});
