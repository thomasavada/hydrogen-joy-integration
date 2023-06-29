import {useEffect} from 'react';

import loadScript from '~/helpers/loadScript';

interface UseJoyLoyaltyCalculatorData {
  product: {
    id: string;
    selectedVariant: unknown; // Update the type accordingly
    handle: string;
    variants: {
      nodes: Array<{
        price: {
          amount: number;
        };
        id: string;
      }>;
    };
    productType: string;
    collections: {
      nodes: Array<{
        title: string;
      }>;
    };
  };
  analytics: {
    pageType: unknown; // Update the type accordingly
  };
}

export default function useJoyLoyaltyCalculator({
  product,
  analytics,
}: UseJoyLoyaltyCalculatorData): void {
  useEffect(() => {
    try {
      (window as any).AVADA_JOY = (window as any).AVADA_JOY || {};
      (window as any).AVADA_JOY.page = analytics.pageType;
      (window as any).AVADA_JOY.product = {
        ...product,
        id: parseInt(product.id.replace('gid://shopify/Product/', '')),
        selectedVariant: product.selectedVariant,
        variants: product.variants.nodes.map((variant) => {
          return {
            ...variant,
            price: variant.price.amount,
            id: parseInt(
              variant.id.replace('gid://shopify/ProductVariant/', ''),
            ),
          };
        }),
        type: product.productType,
        collections: product.collections.nodes
          ? product.collections.nodes.map((node) => node.title)
          : [],
      };
      loadScript({
        id: 'avada-joy-calculator',
        url: `https://cdn.shopify.com/extensions/505ce933-6eff-47ee-a32f-dee5ae134593/0.0.0/assets/avada-joy-points-calculator.min.js?v=${new Date().getTime()}`,
      });
      if ((window as any).avadaJoyRerenderCalculator) {
        (window as any).avadaJoyRerenderCalculator();
      }
    } catch (e) {
      console.log('Cannot init Avada Joy', e);
    }
  }, [product.handle]);
}
