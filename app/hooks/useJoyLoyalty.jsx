import {useEffect} from 'react';

import loadScript from '~/helpers/loadScript';

// @feedback - This hook could be replaced by remix-utils's ow hook should we want to go down this route.
export function useJoyLoyalty(data) {
  useEffect(() => {
    try {
      window.AVADA_JOY = window.AVADA_JOY || {};
      window.AVADA_JOY.customer = data.customer
        ? {
            ...data.customer,
            id: parseFloat(
              data.customer.id.replace('gid://shopify/Customer/', ''),
            ),
          }
        : {email: null, first_name: null, last_name: null, id: null};
      window.AVADA_JOY = {
        ...window.AVADA_JOY,
        placeOrder: {
          ...data.joyData.programPlaceOrder,
        },
      };
      window.AVADA_JOY.account_enabled = 'true';
      window.AVADA_JOY.login_url = '/account/login';
      window.AVADA_JOY.register_url = '/account/register';
      window.AVADA_JOY.cart = data.cart;
      window.AVADA_JOY.shopId = data.joyData.shopId;

      window.Shopify = window.Shopify || {};
      window.Shopify.locale =
        data?.selectedLocale?.language?.toLowerCase() || null;
      window.Shopify.shop = data.layout.shop.primaryDomain.url.replace(
        'https://',
        '',
      );

      loadScript({
        id: 'avada-joy-script',
        url: `https://cdn.shopify.com/extensions/505ce933-6eff-47ee-a32f-dee5ae134593/0.0.0/assets/avada-joy.min.js?v=${new Date().getTime()}`,
      });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log('Cannot initialize Avada Joy');
    }
  }, []);
}
