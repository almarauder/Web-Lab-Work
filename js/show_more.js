document.getElementById("show-more").addEventListener("click", function () {
    const hiddenProducts = document.querySelectorAll(".hidden-products");
    let isHidden = hiddenProducts[0].style.display === "none" || hiddenProducts[0].style.display === "";
    hiddenProducts.forEach(product => {
      product.style.display = isHidden ? "grid" : "none";
    });
    this.textContent = isHidden ? "Show less" : "Show more";
});

const products = document.querySelectorAll(".product");
products.forEach(product => {
    const description = product.querySelector(".description");
    description.style.display = "none";

product.addEventListener("click", (event) => {
    if (event.target.closest(".buy-button")) return;
    description.style.display = (description.style.display === "none") ? "block" : "none";
    });
});