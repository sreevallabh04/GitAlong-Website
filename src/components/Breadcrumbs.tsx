import React from 'react';
import { Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
  isActive?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-sm text-gray-400 mb-8">
      <a 
        href="/" 
        className="flex items-center hover:text-[#2EA043] transition-colors"
        aria-label="Home"
      >
        <Home className="w-4 h-4" />
      </a>
      
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <span className="px-1 text-gray-600">/</span>
          {item.href && !item.isActive ? (
            <a 
              href={item.href}
              className="hover:text-[#2EA043] transition-colors"
            >
              {item.label}
            </a>
          ) : (
            <span 
              className={item.isActive ? "text-white font-medium" : "text-gray-400"}
              aria-current={item.isActive ? "page" : undefined}
            >
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

// Structured data for breadcrumbs
export const BreadcrumbStructuredData: React.FC<{ items: BreadcrumbItem[] }> = ({ items }) => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://gitalong.vercel.app"
      },
      ...items.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 2,
        "name": item.label,
        "item": item.href ? `https://gitalong.vercel.app${item.href}` : undefined
      }))
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData)
      }}
    />
  );
};
