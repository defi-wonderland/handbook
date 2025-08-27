import { useEffect } from 'react';
import { useLocation } from '@docusaurus/router';

/**
 * Custom hook to reset scroll position when navigating to specific routes
 * @param routes - Array of route patterns to trigger scroll reset
 * @param behavior - Scroll behavior ('auto', 'smooth', or 'instant')
 */
export function useScrollReset(
  routes: string[] = ['/blog'],
  behavior: ScrollBehavior = 'auto'
) {
  const location = useLocation();

  useEffect(() => {
    const shouldReset = routes.some(route => {
      // Check if the pathname starts with the route (handles both /blog and /blog/)
      return location.pathname.startsWith(route);
    });

    if (shouldReset) {
      // Try multiple approaches to ensure scroll reset works
      const resetScroll = () => {
        // Method 1: Direct scroll
        window.scrollTo({
          top: 0,
          left: 0,
          behavior
        });
        
        // Method 2: Force scroll on document element
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
        
        // Method 3: Force scroll on window
        window.scrollY = 0;
      };

      // Try immediate reset
      resetScroll();
      
      // Try with requestAnimationFrame
      requestAnimationFrame(resetScroll);
      
      // Try with a small delay to ensure DOM is ready
      setTimeout(resetScroll, 100);
      
      // Try with a longer delay as fallback
      setTimeout(resetScroll, 500);
    }
  }, [location.pathname, routes, behavior]);
}

/**
 * Hook specifically for blog post navigation
 */
export function useBlogScrollReset() {
  useScrollReset(['/blog'], 'auto');
}
