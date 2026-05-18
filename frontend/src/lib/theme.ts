"use client";

import { SiteTheme } from '@/types/site';

export function generateThemeCSS(theme: SiteTheme, scopeClass?: string) {
  const primary = theme.primaryColor || '#e8aa20';
  
  // Custom design token fallbacks
  const secondary = (theme as any).secondaryColor || '#1e293b';
  const accent = (theme as any).accentColor || '#f59e0b';
  const fontHeading = (theme as any).headingFont || theme.font || 'Outfit';
  const fontBody = (theme as any).bodyFont || theme.font || 'Inter';
  const radius = (theme as any).borderRadius || '0.75rem';
  
  // Shadow lookup table
  const shadowValue = (theme as any).shadowStyle === 'none' ? 'none' :
                      (theme as any).shadowStyle === 'sm' ? '0 1px 2px 0 rgba(0, 0, 0, 0.05)' :
                      (theme as any).shadowStyle === 'md' ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' :
                      (theme as any).shadowStyle === 'lg' ? '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' :
                      (theme as any).shadowStyle === 'xl' ? '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' :
                      '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'; // default lg
                      
  const selector = scopeClass ? `.${scopeClass}` : ':root';
  
  return `
    ${selector} {
      --primary-color: ${primary};
      --secondary-color: ${secondary};
      --accent-color: ${accent};
      --heading-font: "${fontHeading}", "Outfit", sans-serif;
      --body-font: "${fontBody}", "Inter", sans-serif;
      --border-radius: ${radius};
      --shadow-style: ${shadowValue};
      
      /* Global helper vars */
      --btn-bg: var(--primary-color);
      --btn-text: #ffffff;
      --card-radius: var(--border-radius);
      --card-shadow: var(--shadow-style);
      --heading-family: var(--heading-font);
      --body-family: var(--body-font);
    }
    
    ${selector} h1, ${selector} h2, ${selector} h3, ${selector} h4, ${selector} h5, ${selector} h6 {
      font-family: var(--heading-font) !important;
    }
    
    ${selector} p, ${selector} span, ${selector} a, ${selector} li, ${selector} button, ${selector} label, ${selector} input, ${selector} textarea {
      font-family: var(--body-font) !important;
    }
    
    ${selector} .theme-primary-bg {
      background-color: var(--primary-color) !important;
    }
    
    ${selector} .theme-primary-text {
      color: var(--primary-color) !important;
    }
    
    ${selector} .theme-primary-border {
      border-color: var(--primary-color) !important;
    }
    
    ${selector} .theme-secondary-bg {
      background-color: var(--secondary-color) !important;
    }
    
    ${selector} .theme-secondary-text {
      color: var(--secondary-color) !important;
    }
    
    ${selector} .theme-accent-bg {
      background-color: var(--accent-color) !important;
    }
    
    ${selector} .theme-accent-text {
      color: var(--accent-color) !important;
    }
    
    ${selector} .theme-card-rounded {
      border-radius: var(--border-radius) !important;
    }
    
    ${selector} .theme-card-shadow {
      box-shadow: var(--shadow-style) !important;
    }
    
    /* Premium smooth visual transitions */
    ${selector} * {
      transition-property: background-color, border-color, text-decoration-color, fill, stroke;
      transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
      transition-duration: 300ms;
    }
  `;
}
