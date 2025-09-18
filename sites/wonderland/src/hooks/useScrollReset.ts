import { useLocation } from '@docusaurus/router';
import { resetScroll } from '../utils/scrollReset';

/**
 * Hook that returns a scroll reset function for specific routes
 * @param routes - Array of route patterns to check against current pathname
 */
export function useScrollReset(routes: string[] = ['/blog']) {
  const location = useLocation();

  return () => {
    resetScroll(location.pathname, routes, 'auto');
  };
}