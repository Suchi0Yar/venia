

export default function decorate(block) {

    const productName = getMetadata('productname') || 'Stretch Belt With Leather Clasp';

    block.innerHTML = `
        <nav class="breadcrumb">
            <a href="/author" title="Home">Home</a> / <span>${productName}</span>
        </nav>
    `;
}
