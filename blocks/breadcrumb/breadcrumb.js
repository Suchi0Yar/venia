import { getMetadata } from "../../scripts/aem.js";

export default function decorate(block) {
    const pageTitle = getMetadata('pname') || 'Current Page';
    block.innerHTML = `
        <nav class="breadcrumb">
            <a href="/author" title="Home">Home</a> 
            <span class="breadcrumb-separator"> / </span>
            <span class="breadcrumb-current">${pageTitle}</span>
        </nav>
    `;
}
