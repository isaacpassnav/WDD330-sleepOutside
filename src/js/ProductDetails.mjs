import { getLocalStorage, setLocalStorage } from "./utils.mjs";

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = null;
    this.dataSource = dataSource;
  }
  async init() {
    try {
      this.product = await this.dataSource.findProductById(this.productId);

      if (!this.product) {
        console.error("Product not found!");
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
    const container = document.getElementById("productDetails");
    if (!container) {
      console.error("Product details container not found!");
      return;
    }

    container.innerHTML = this.productDetailsTemplate(this.product);
  }

  productDetailsTemplate(product) {
    return `
      <section class="product-detail">
        <h3>${product.Brand?.Name || "Unknown Brand"}</h3>
        <h2 class="divider">${product.NameWithoutBrand || "No Name"}</h2>
        <img
          class="divider"
          src="${product.Image || "placeholder.jpg"}"
          alt="${product.NameWithoutBrand || "Product Image"}"
        />
        <p class="product-card__price">$${product.FinalPrice || "N/A"}</p>
        <p class="product__color">${product.Colors?.[0]?.ColorName || "No Color Available"}</p>
        <p class="product__description">
          ${product.DescriptionHtmlSimple || "No description available."}
        </p>
        <div class="product-detail__add">
          <button id="addToCart" data-id="${product.Id}">Add to Cart</button>
        </div>
      </section>
    `;
  }

  displayErrorMessage() {
    const container = document.getElementById("productDetails");
    if (container) {
      container.innerHTML = `<p class="error-message">Product not found. Please try again later.</p>`;
    }
  }
}


