// Types
import type { Category, CategoryCardsTheme } from "./CategoryCards";
import type { HeroSectionProps } from "./HeroSection";
import type { Handbook, HandbookSectionProps } from "./HandbookSection";
import type { IlustrationsContainerProps } from "./IlustrationsContainer";

// Components
import HeroSection from "./HeroSection";
import CategoryCards from "./CategoryCards";
import IlustrationsContainer from "./IlustrationsContainer";
import StarsBackground from "./StarsBackground";
import HandbookSection from "./HandbookSection";
import {
  NoiseBackground,
  FooterBackground,
  TriangleBackground,
} from "./Backgrounds";

// Theme Components
import Root from "./theme/Root";
import DocRootLayoutSidebarExpandButton from "./theme/DocRoot/Layout/Sidebar/ExpandButton";
import DocSidebarDesktopCollapseButton from "./theme/DocSidebar/Desktop/CollapseButton";

// Export Types
export type {
  Category,
  CategoryCardsTheme,
  HeroSectionProps,
  Handbook,
  HandbookSectionProps,
  IlustrationsContainerProps,
};

export {
  // Custom Components
  HeroSection,
  CategoryCards,
  IlustrationsContainer,
  NoiseBackground,
  FooterBackground,
  TriangleBackground,
  StarsBackground,
  HandbookSection,
  // Swizzled Theme Components
  Root,
  DocRootLayoutSidebarExpandButton,
  DocSidebarDesktopCollapseButton,
};
