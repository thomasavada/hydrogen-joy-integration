import {useEffect} from 'react';

import loadScript from '~/helpers/loadScript';

interface UseJoyLoyaltyData {
  customer: {
    id: string;
    email: string | null;
    firstName: string | null;
    lastName: string | null;
  } | null;
  joyData: {
    programPlaceOrder: Record<string, unknown>;
    shopId: string;
  };
  cart: unknown; // Update the type of `cart` accordingly
  selectedLocale: {
    language: string;
  } | null;
  layout: {
    shop: {
      primaryDomain: {
        url: string;
      };
    };
  };
}

export function useJoyLoyalty(data: UseJoyLoyaltyData): void {
  useEffect(() => {
    try {
      (window as any).AVADA_JOY = (window as any).AVADA_JOY || {};
      (window as any).AVADA_JOY.customer = data.customer
        ? {
            ...data.customer,
            first_name: data.customer.firstName,
            last_name: data.customer.lastName,
            id: parseFloat(
              data.customer.id.replace('gid://shopify/Customer/', ''),
            ),
          }
        : {email: null, first_name: null, last_name: null, id: null};
      (window as any).AVADA_JOY = {
        ...(window as any).AVADA_JOY,
        placeOrder: {
          ...data.joyData.programPlaceOrder,
        },
      };
      (window as any).AVADA_JOY.account_enabled = 'true';
      (window as any).AVADA_JOY.login_url = '/account/login';
      (window as any).AVADA_JOY.register_url = '/account/register';
      (window as any).AVADA_JOY.cartProducts = data.cart;
      (window as any).AVADA_JOY.shopId = data.joyData.shopId;

      (window as any).Shopify = (window as any).Shopify || {};
      (window as any).Shopify.locale =
        data?.selectedLocale?.language?.toLowerCase() || null;
      (window as any).Shopify.shop = data.layout.shop.primaryDomain.url.replace(
        'https://',
        '',
      );

      loadScript({
        id: 'avada-joy-script',
        url: `https://cdn.shopify.com/extensions/505ce933-6eff-47ee-a32f-dee5ae134593/0.0.0/assets/avada-joy.min.js?v=${new Date().getTime()}`,
      });
    } catch (e) {
      console.log('Cannot initialize Avada Joy', e);
    }
  }, []);
}
