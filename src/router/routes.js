const routes = [
    {
        path: '/',
        component: () => import('layouts/MainLayout.vue'),
        meta: { requiresAuth: true},
        children: [
            {path: '', component: () => import('pages/IndexPage.vue')}
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
                meta: { guestOnly: true }
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
