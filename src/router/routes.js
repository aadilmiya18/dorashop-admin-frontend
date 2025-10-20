const routes = [
    {
        path: '/',
        component: () => import('layouts/MainLayout.vue'),
        meta: {requiresAuth: true},
        children: [
            {
                path: '',
                name: 'Home',
                component: () => import('pages/IndexPage.vue')
            },
            {
                path: '/products',
                name: 'Products',
                component: () => import('pages/Products/ProductsPage.vue'),
            },
            {
                path: '/products/create',
                name: 'ProductsCreate',
                component: () => import('pages/Products/ProductsCreatePage.vue'),
            },
            {
                path: '/brands',
                name: 'Brands',
                component: () => import('pages/Brands/BrandsPage.vue')
            },
            {
                path: '/brands/create',
                name: 'BrandsCreate',
                component: () => import('pages/Brands/BrandsCreatePage.vue'),
            },
            {
                path: '/brands/:id/edit',
                name: 'BrandsEdit',
                component: () => import('pages/Brands/BrandsEditPage.vue'),
            },
            {
                path: '/categories',
                name: 'Categories',
                component: () => import('pages/Categories/CategoriesPage.vue')
            },
            {
                path: '/categories/create',
                name: 'CategoriesCreate',
                component: () => import('pages/Categories/CategoriesCreatePage.vue'),
            },
        ]
    },
    {
        path: '/login',
        component: () => import('layouts/LoginLayout.vue'),
        children: [
            {
                path: '',
                name: 'Login',
                component: () => import('pages/LoginPage.vue'),
                meta: {guestOnly: true}
            },
        ]
    },

    // Always leave this as last one,
    // but you can also remove it
    {
        path: '/:catchAll(.*)*',
        component: () => import('pages/ErrorNotFound.vue')
    }
]

export default routes
