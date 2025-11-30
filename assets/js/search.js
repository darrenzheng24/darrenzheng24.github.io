(async function() {
    // Get the search query from the URL
    function getQuery() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('q') || '';
    }

    const query = getQuery().replace(/['"']/g, ''); // Remove quotation marks
    if (!query) return;

    const pagefind = await import("/pagefind/pagefind.js");
    await pagefind.options({
        highlightParam: "highlight",
        excerptLength: 50,
    });
    const search = await pagefind.debouncedSearch(query);
    const TotalResults = await Promise.all(search.results.map(r => r.data()));

    const resultsContainer = document.getElementById('search-results');
    const titleElement = document.getElementById('search-results-title');

    // Update the h1 element with the italicized and bolded search query
    titleElement.innerHTML = `Search Results for <b>${query}</b>`;

    // Filter out results linking to the default "/" URL
    const filteredResults = TotalResults.filter(r => r.raw_url !== "/");

    // Convert relative URLs to absolute URLs
    const baseUrl = window.location.origin;
    filteredResults.forEach(r => {
        r.raw_url = `${baseUrl}${r.raw_url}`;

        // Modify the excerpt to remove Title, Date, and Read Time information
        const readIndex = r.excerpt.indexOf("read");
        if (readIndex !== -1) {
            r.excerpt = r.excerpt.substring(readIndex + 4).trim();
        }
    });

    if (filteredResults.length === 0) {
        resultsContainer.innerHTML = '<p>No results found.</p>';
        return;
    }

    resultsContainer.innerHTML = filteredResults.map(r => `
        <div class="search-result">
            <a href="${r.raw_url}">${r.meta.title}</a>
            <p>${r.excerpt}</p>
        </div>
    `).join('');
})();