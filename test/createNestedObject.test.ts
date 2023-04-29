/* eslint-disable @typescript-eslint/no-explicit-any */

import set from 'lodash.set';

const TEST_NON_MATCH_URL =
    '/_next/static/chunks/pages/majors/%5BmajorId%5D/pages/%5BpageId%5D-4ea3f9ddbd870821.js';

const COMPLEX_TEST_OBJECT = {
  majors: {
    '*': {
      '___page': '/majors/[majorId]',
      'apps': {
        '___page': '/majors/[majorId]/apps',
        '*': {
          install: {
            ___page:
                            '/majors/[majorId]/apps/[appId]/install',
          },
        },
      },
      'collections': {
        '___page': '/majors/[majorId]/collections',
        'create': {
          ___page: '/majors/[majorId]/collections/create',
        },
        '*': {
          ___page:
                        '/majors/[majorId]/collections/[collectionId]',
          images: {
            add: {
              ___page:
                                '/majors/[majorId]/collections/[collectionId]/images/add',
            },
          },
        },
      },
      'edit': { ___page: '/majors/[majorId]/edit' },
      'orders': {
        '___page': '/majors/[majorId]/orders',
        'create': {
          ___page: '/majors/[majorId]/orders/create',
        },
        '*': {
          '___page': '/majors/[majorId]/orders/[orderId]',
          'order-items': {
            'create': {
              ___page:
                                '/majors/[majorId]/orders/[orderId]/order-items/create',
            },
            '*': {
              ___page:
                                '/majors/[majorId]/orders/[orderId]/order-items/[orderItemId]',
            },
          },
        },
      },
      'pages': {
        '___page': '/majors/[majorId]/pages',
        'create': {
          ___page: '/majors/[majorId]/pages/create',
        },
        '*': {
          ___page: '/majors/[majorId]/pages/[pageId]',
          images: {
            add: {
              ___page:
                                '/majors/[majorId]/pages/[pageId]/images/add',
            },
          },
        },
      },
      'payment-gateway': {
        ___page: '/majors/[majorId]/payment-gateway',
      },
      'products': {
        '___page': '/majors/[majorId]/products',
        'create': {
          ___page: '/majors/[majorId]/products/create',
        },
        'create-from-supplier-product': {
          ___page:
                        '/majors/[majorId]/products/create-from-supplier-product',
        },
        '*': {
          ___page: '/majors/[majorId]/products/[productId]',
          images: {
            'add': {
              ___page:
                                '/majors/[majorId]/products/[productId]/images/add',
            },
            '*': {
              ___page:
                                '/majors/[majorId]/products/[productId]/images/[contentItemId]',
            },
          },
          variants: {
            'create': {
              ___page:
                                '/majors/[majorId]/products/[productId]/variants/create',
            },
            '*': {
              ___page:
                                '/majors/[majorId]/products/[productId]/variants/[variantId]',
              add: {
                ___page:
                                    '/majors/[majorId]/products/[productId]/variants/[variantId]/add',
              },
            },
          },
        },
      },
      'storefronts': {
        '___page': '/majors/[majorId]/storefronts',
        'create': {
          ___page: '/majors/[majorId]/storefronts/create',
        },
        '*': {
          '___page':
                        '/majors/[majorId]/storefronts/[storefrontId]',
          'customers': {
            '___page':
                            '/majors/[majorId]/storefronts/[storefrontId]/customers',
            'create': {
              ___page:
                                '/majors/[majorId]/storefronts/[storefrontId]/customers/create',
            },
            '*': {
              ___page:
                                '/majors/[majorId]/storefronts/[storefrontId]/customers/[customerId]',
            },
          },
          'navs': {
            ___page:
                            '/majors/[majorId]/storefronts/[storefrontId]/navs',
            create: {
              ___page:
                                '/majors/[majorId]/storefronts/[storefrontId]/navs/create',
            },
          },
          'type-contents': {
            ___page:
                            '/majors/[majorId]/storefronts/[storefrontId]/type-contents',
          },
        },
      },
      'subscriptions': {
        ___page: '/majors/[majorId]/subscriptions',
      },
      'suppliers': {
        ___page: '/majors/[majorId]/suppliers',
        request: {
          ___page: '/majors/[majorId]/suppliers/request',
        },
      },
      'taxonomy': {
        ___page: '/majors/[majorId]/taxonomy',
        create: {
          ___page: '/majors/[majorId]/taxonomy/create',
        },
      },
      'users': {
        '___page': '/majors/[majorId]/users',
        'add': { ___page: '/majors/[majorId]/users/add' },
        '*': {
          ___page: '/majors/[majorId]/users/[userName]',
        },
      },
    },
  },
};

const SIMPLE_TEST_OBJECT = {
  a: { b: { 'c': { ___page: '/a/b/c' }, '*': { ___page: '/a/b/[dynamic]' } } },
};

// This mimics logic inside the cloudfront function
const testFunction = (obj: any, uriSections: any): string | null => {
  let currentRouteObject = obj;
  for (let i = 0; i < uriSections.length; i++) {
    const uriSection = uriSections[i];
    const isLastUriSection = i === uriSections.length - 1;

    if (currentRouteObject[uriSection]) {
      // exact match
      if (isLastUriSection) {
        if (currentRouteObject[uriSection].___page) {
          return currentRouteObject[uriSection].___page;
        }
      }

      currentRouteObject = currentRouteObject[uriSection];
      continue;

    } else if (currentRouteObject['*']) {
      // dynamic match
      if (isLastUriSection) {
        if (currentRouteObject['*'].___page) {
          return currentRouteObject['*'].___page;
        }
      }

      currentRouteObject = currentRouteObject['*'];
      continue;
    }
    break;
  }

  return null;
};

function hasExtension(url: string): boolean {
  const parts = url.split('/'),
    last = parts.pop();
  return !!last && typeof last === 'string' && last.indexOf('.') !== -1;
}

describe('createNestedObject', () => {
  it('should create a nested object', () => {
    const obj = set(
      { a: { b: { existing: {} } } },
      ['a', 'b', 'c'].join('.'),
      { ___page: '/a/b/c' },
    );
    expect(obj).toEqual({
      a: { b: { c: { ___page: '/a/b/c' }, existing: {} } },
    });
  });

  it('Should find the right normal page', () => {
    const uriSections = ['a', 'b', 'c'];
    const result = testFunction(SIMPLE_TEST_OBJECT, uriSections);
    expect(result).toEqual('/a/b/c');
  });

  it('Should find the right dynamic page', () => {
    const uriSections = ['a', 'b', 'anything'];
    const result = testFunction(SIMPLE_TEST_OBJECT, uriSections);
    expect(result).toEqual('/a/b/[dynamic]');
  });

  it('Should not match on something that shouldnt', () => {
    const uriSections = TEST_NON_MATCH_URL.split('/');
    const result = testFunction(COMPLEX_TEST_OBJECT, uriSections);
    expect(result).toBeNull();
  });

  it('Should detect an extension', () => {
    const result = hasExtension('/a/b/c.json?go=go#anchorToo');
    expect(result).toEqual(true);
  });
});
