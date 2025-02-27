function generateBreadcrumbHTML() {
    const segments = window.location.pathname.split('/').filter(Boolean);
    let path = '';
    
    return `
        <span class="breadcrumb-link"><a href="/">Start</a></span>
        ${segments.map((segment, index) => {
            path += `/${segment}`;
            return `
                <span class="breadcrumb-divider">/</span>
                ${index === segments.length - 1 
                    ? `<span class="breadcrumb-link current">${segment}</span>` 
                    : `<span class="breadcrumb-link"><a href="${path}">${segment}</a></span>`}
            `;
        }).join('')}
    `;
}

