(function () {
    function initCaptions() {
        console.log('Caption script initializing...');

        const postContent = document.querySelector('.article-post');
        if (!postContent) {
            console.log('No .article-post found');
            return;
        }

        const images = postContent.querySelectorAll('img');
        console.log(`Found ${images.length} images in post`);

        images.forEach(img => {
            try {
                // Skip if already processed or specific UI element
                if (img.closest('figure') || img.classList.contains('emoji') || img.hasAttribute('data-caption-processed')) return;

                // Mark as processed to avoid double-processing
                img.setAttribute('data-caption-processed', 'true');

                let captionText = img.getAttribute('alt');
                const titleText = img.getAttribute('title');

                if (!captionText || captionText.trim() === '') {
                    captionText = titleText;
                }

                if (captionText && captionText.trim() !== '') {
                    console.log(`Adding caption for image: ${captionText}`);
                    const figure = document.createElement('figure');
                    figure.style.display = "block"; // Force display block

                    const figcaption = document.createElement('figcaption');
                    figcaption.textContent = captionText;
                    figcaption.style.display = "block"; // Force display block

                    const parent = img.parentNode;

                    // Handle P tags - browsers don't like figure inside p
                    if (parent.tagName === 'P') {
                        // Insert figure after the P tag
                        // This assumes the image is at the end or standalone. 
                        // If it's in the middle, this splits the content, which is acceptable for a block element like figure.
                        if (parent.nextSibling) {
                            parent.parentNode.insertBefore(figure, parent.nextSibling);
                        } else {
                            parent.parentNode.appendChild(figure);
                        }
                        figure.appendChild(img);

                        // If P tag is now empty (or just whitespace), remove it
                        if (parent.textContent.trim() === '' && parent.children.length === 0) {
                            parent.remove();
                        }
                    } else {
                        parent.insertBefore(figure, img);
                        figure.appendChild(img);
                    }

                    figure.appendChild(figcaption);
                }
            } catch (e) {
                console.error('Error processing image:', e);
            }
        });
    }

    // Run on DOMContentLoaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCaptions);
    } else {
        initCaptions();
    }

    // Run again on window load
    window.addEventListener('load', initCaptions);

    // Polling for safety (in case of dynamic loading)
    setTimeout(initCaptions, 1000);
    setTimeout(initCaptions, 3000);
})();
