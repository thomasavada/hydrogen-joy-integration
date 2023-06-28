import {useEffect} from 'react';

import loadScript from '~/helpers/loadScript';

/**
 *
 */
export default function useJoyLoyaltyCalculator({product, analytics}) {
  useEffect(() => {
    try {
      window.AVADA_JOY = window.AVADA_JOY || {};
      window.AVADA_JOY.page = analytics.pageType;
      window.AVADA_JOY.product = {
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
      if (window.avadaJoyRerenderCalculator)
        window.avadaJoyRerenderCalculator();
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log('Cannot init Avada Joy');
    }
  }, [product.handle]);
}
