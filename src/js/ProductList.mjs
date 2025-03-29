import { renderListWithTemplate } from "./utils.mjs";

function productCardTemplate(product) {
  return `
    <li class="product-card">
      <a href="product_pages/?products=${product.Id}">
        <img src="${product.Image}" alt="${product.Name}">
        <h2>${product.Brand?.Name || "Unknown Brand"}</h2>
        <h3>${product.Name}</h3>
        <p class="product-card__price">$${product.FinalPrice || "N/A"}</p>
      </a>
    </li>
    `;
}

export default class ProductList {
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
  }

  async init() {
    const list = await this.dataSource.getData();
    // Filtrar por categoría como en tu código original
    const filteredList = list.filter(item => item.category === this.category);
    this.renderList(filteredList);
  };

  renderList(products) {
    if (!this.listElement) {
        console.error("Error: listElement no encontrado en el DOM.");
        return;
    }
    renderListWithTemplate(productCardTemplate, this.listElement, products);
  };

}
