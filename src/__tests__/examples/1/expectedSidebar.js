export const expectedSidebar = []

expectedSidebar[0] = [
    {
        path: '/storage',
        name: 'storage',
        meta: {
            title: 'storage'
        }
    },
    {
        path: '/api',
        name: 'api',
        meta: {
            title: 'api'
        }
    },
]

expectedSidebar[1] = [
    {
        path: '/storage',
        name: 'storage',
        meta: {
            title: 'storage'
        },
        children: [
            {
                path: '/storage/models',
                name: 'storage_models',
                meta: {
                    title: 'models'
                },
            },
            {
                path: '/storage/fields',
                name: 'storage_fields',
                meta: {
                    title: 'fields'
                },
            }
        ]
    },
    {
        path: '/api',
        name: 'api',
        meta: {
            title: 'api'
        },
        children: [
            {
                path: '/api/apis',
                name: 'api_apis',
                meta: {
                    title: 'apis'
                },
            },
            {
                path: '/api/endpoints',
                name: 'api_endpoints',
                meta: {
                    title: 'endpoints'
                },
            }
        ]
    },
]
