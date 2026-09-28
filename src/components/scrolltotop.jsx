import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Sends the window back to the top whenever the path changes.
 * Pagination and filter changes only touch the query string, so they are
 * ignored on purpose (each page scrolls itself in that case).
 */
function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    }, [pathname]);

    return null;
}

export default ScrollToTop;
