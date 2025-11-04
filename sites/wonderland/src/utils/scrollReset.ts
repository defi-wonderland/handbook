/**
 * Reset scroll position for specific routes
 * @param pathname - Current pathname to check against routes
 * @param routes - Array of route patterns to check against current pathname
 * @param behavior - Scroll behavior (defaults to 'auto')
 */
export function resetScroll(
  pathname: string,
  routes: string[] = ['/blog'],
  behavior: ScrollBehavior = 'auto'
) {
  const shouldReset = routes.some(route => {
    // Check if the pathname starts with the route (handles both /blog and /blog/)
    return pathname.startsWith(route);
  });

  if (!shouldReset) return;

  // Optimized scroll reset - try immediate and with requestAnimationFrame
  const performReset = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior
    });

    // Fallback for older browsers or edge cases
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  };

  // Try immediate reset
  performReset();

  // Try with requestAnimationFrame to ensure DOM is ready
  requestAnimationFrame(performReset);
}
