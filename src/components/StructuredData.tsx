import React from 'react';
import { Helmet } from 'react-helmet-async';

interface StructuredDataProps {
  type: 'Website' | 'Organization' | 'WebApplication' | 'SoftwareApplication' | 'Article' | 'Person';
  data: any;
}

export const StructuredData: React.FC<StructuredDataProps> = ({ type, data }) => {
  const generateStructuredData = () => {
    const baseData = {
      "@context": "https://schema.org",
      "@type": type,
      ...data
    };

    return JSON.stringify(baseData);
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {generateStructuredData()}
      </script>
    </Helmet>
  );
};

// Pre-defined structured data for common use cases
export const WebsiteStructuredData: React.FC = () => (
  <StructuredData
    type="Website"
    data={{
      name: "GitAlong",
      description: "Find your perfect coding partner and collaborate on amazing projects",
      url: "https://gitalong.vercel.app",
      potentialAction: {
        "@type": "SearchAction",
        target: "https://gitalong.vercel.app/about?search={search_term_string}",
        "query-input": "required name=search_term_string"
      },
      publisher: {
        "@type": "Organization",
        name: "GitAlong",
        logo: {
          "@type": "ImageObject",
          url: "https://gitalong.vercel.app/app_icon.jpg"
        }
      }
    }}
  />
);

export const OrganizationStructuredData: React.FC = () => (
  <StructuredData
    type="Organization"
    data={{
      name: "GitAlong",
      description: "A platform connecting developers for collaborative coding projects",
      url: "https://gitalong.vercel.app",
      logo: "https://gitalong.vercel.app/app_icon.jpg",
      foundingDate: "2024",
      sameAs: [
        "https://github.com/sreevallabh04/GitAlong-Website"
      ],
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer service",
        url: "https://gitalong.vercel.app/contact"
      }
    }}
  />
);

export const WebApplicationStructuredData: React.FC = () => (
  <StructuredData
    type="WebApplication"
    data={{
      name: "GitAlong",
      description: "Connect with developers, find coding partners, and collaborate on projects",
      url: "https://gitalong.vercel.app",
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Web Browser",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD"
      },
      author: {
        "@type": "Organization",
        name: "GitAlong Team"
      },
      screenshot: "https://gitalong.vercel.app/og-image.png"
    }}
  />
);
