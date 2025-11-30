window.addEventListener('DOMContentLoaded', () => {
    observer = initializeObserver();
});

function initializeObserver() {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            const number = entry.target.getAttribute('for').match(/\d+$/)[0];
            const sidenoteItem = document.querySelector(`.sidenote-item[number="${number}"]`);

            if (entry.intersectionRatio > 0) {
                // Find the corresponding sidenote-item div and add the visible class
                if (sidenoteItem) {
                    sidenoteItem.classList.add('visible');
                }
            } else {
                if (sidenoteItem) {
                    sidenoteItem.classList.remove('visible');
                }
            }
        });
    }, {
        root: document.querySelector('.content-container'), // Updated to use the content container
    });

    const sidenoteLabels = document.querySelectorAll(".sidenote-label");
    sidenoteLabels.forEach(label => {
        observer.observe(label);
        syncSidenoteLabel(label);
    });

    return observer;
}

function syncSidenoteLabel(label) {
    const number = label.getAttribute('for').match(/\d+$/)[0];
    const sidenoteItem = document.querySelector(`.sidenote-item[number="${number}"]`);

    const sidenoteTitle = document.querySelector('.article-toc > h4').getBoundingClientRect().top;
    if (sidenoteItem) {
        const topDistance = label.getBoundingClientRect().top;
        sidenoteItem.style.top = `${topDistance - sidenoteTitle - sidenoteItem.getBoundingClientRect().height}px`;
    } else {
        console.warn(`Sidenote item not found for label ${number}`);
    }
}

// Add scroll event listener to the content container
const container = document.querySelector('main.content.container');
if (container) {
  container.addEventListener('scroll', function () {
    const sidenoteLabels = document.querySelectorAll(".sidenote-label");
    sidenoteLabels.forEach(label => {
        syncSidenoteLabel(label);
    });
  });
}

const tableOfContentsDropdown = document.querySelector(".toc-wrapper");
if (tableOfContentsDropdown) {
    tableOfContentsDropdown.addEventListener('click', function() {
        setTimeout(() => {
            const sidenoteLabels = document.querySelectorAll(".sidenote-label");
            sidenoteLabels.forEach(label => {
                syncSidenoteLabel(label);
            });
        }, 0);
    });
}

// Force scroll events to also apply to a specific container
const scrollable = document.querySelector('.content.container');
const toc = document.querySelector('.article-toc');

if (scrollable && toc) {
    toc.addEventListener('wheel', (e) => {
    e.preventDefault(); // prevent default page scroll
    scrollable.scrollTop += e.deltaY; // apply scroll to container
    }, { passive: false });
}