import { getLocalStorage, setLocalStorage } from "./utils.mjs";

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }

  async init() {
    try {
      console.log("Fetching product with ID:", this.productId);
      this.product = await this.dataSource.findProductById(this.productId);

      if (!this.product) {
        console.error("Product not found!", this.productId);
        this.displayErrorMessage();
        return;
      }

      this.renderProductDetails();
      document
        .getElementById("addToCart")
        .addEventListener("click", this.addProductToCart.bind(this));
    } catch (error) {
      console.error("Error fetching product details:", error);
      this.displayErrorMessage();
    }
  }

  addProductToCart() {
    const cartItems = getLocalStorage("so-cart") || [];
    cartItems.push(this.product);
    setLocalStorage("so-cart", cartItems);
  }

  renderProductDetails() {
    if (!this.product) {
      console.error("No product data available!");
      return;
    }

    document.querySelector("h2").textContent = this.product.Brand?.Name || "Unknown Brand";
    document.querySelector("h3").textContent = this.product.NameWithoutBrand || "No Name";
    
    const productImage = document.getElementById("productImage");
    if (productImage) {
      productImage.src = this.product.Image || "placeholder.jpg";
      productImage.alt = this.product.NameWithoutBrand || "Product Image";
    }

    document.getElementById("productPrice").textContent = `$${this.product.FinalPrice || "N/A"}`;
    document.getElementById("productColor").textContent = this.product.Colors?.[0]?.ColorName || "No Color Available";
    document.getElementById("productDesc").innerHTML = this.product.DescriptionHtmlSimple || "No description available.";

    document.getElementById("addToCart").dataset.id = this.product.Id;
  }
    
  displayErrorMessage() {
    const container = document.getElementById("productDetails");
    if (container) {
      container.innerHTML = `<p class="error-message">Product not found. Please try again later.</p>`;
    }
  }
}



