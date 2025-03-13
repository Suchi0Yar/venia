export default function decorate(block) {
    const divs = Array.from(block.children);
    console.log(divs[0]);
 
    const productMediaWrapper = document.createElement("div");
    productMediaWrapper.classList.add("all-images");
 
    productMediaWrapper.appendChild(divs[0]);
    productMediaWrapper.appendChild(divs[1]);
 
    divs[0].classList.add("small-images");
    divs[1].classList.add("main-images");
 
    block.insertBefore(productMediaWrapper, divs[2]);
}
