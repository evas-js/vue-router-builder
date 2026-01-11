import Error404Page from "../../../components/Error404Page.vue"
import GroupPage from "../../../components/GroupPage.vue"
import { importComponentCb } from "../../examples.help"

export const expectedRoutes = [
    {
        path: '/storage',
        name: 'storage',
        meta: {
            title: 'storage'
        },
        component: GroupPage,
        children: [
            {
                path: '/storage/models',
                name: 'storage_models',
                meta: {
                    title: 'models'
                },
                component: GroupPage,
                children: [
                    {
                        path: '/storage/models/list',
                        name: 'storage_models_list',
                        meta: {
                            title: 'list',
                            componentName: '/storage/ModelListPage'
                        },
                        component: importComponentCb('/storage/ModelListPage')
                    },
                    {
                        path: '/storage/models:catch(.*)',
                        name: 'redirect_catch_storage_models',
                        redirect: {
                            name: 'storage_models_list',
                            params: undefined
                        },
                    },
                    {
                        path: '/storage/models',
                        name: 'redirect_storage_models',
                        redirect: {
                            name: 'storage_models_list',
                            params: undefined
                        },
                    }
                ],
                redirect: {
                    name: 'storage_models_list',
                    params: undefined
                },
                props: {
                    links: [
                        {
                            path: '/storage/models/list',
                            name: 'storage_models_list',
                            meta: {
                                title: 'list',
                                componentName: '/storage/ModelListPage',
                            },
                            params: undefined,
                        },
                    ],
                },
            },
            {
                path: '/storage/fields',
                name: 'storage_fields',
                meta: {
                    title: 'fields'
                },
                component: GroupPage,
                children: [
                    {
                        path: '/storage/fields/list',
                        name: 'storage_fields_list',
                        meta: {
                            title: 'list',
                            componentName: '/storage/fields/ListPage'
                        },
                        component: importComponentCb('/storage/fields/ListPage')
                    },
                    {
                        path: '/storage/fields:catch(.*)',
                        name: 'redirect_catch_storage_fields',
                        redirect: {
                            name: 'storage_fields_list',
                            params: undefined
                        },
                    },
                    {
                        path: '/storage/fields',
                        name: 'redirect_storage_fields',
                        redirect: {
                            name: 'storage_fields_list',
                            params: undefined
                        },
                    }
                ],
                redirect: {
                    name: 'storage_fields_list',
                    params: undefined
                }
            },
            {
                path: '/storage:catch(.*)',
                name: 'redirect_catch_storage',
                redirect: {
                    name: 'storage_models_list',
                    params: undefined
                },
            },
            {
                path: '/storage',
                name: 'redirect_storage',
                redirect: {
                    name: 'storage_models_list',
                    params: undefined
                },
            }
        ],
        redirect: {
            name: 'storage_models_list',
            params: undefined
        },
        props: {
            links: [
                {
                    path: '/storage/models',
                    name: 'storage_models',
                    meta: {
                        title: 'models',
                    },
                    params: undefined,
                },
                {
                    path: '/storage/fields',
                    name: 'storage_fields',
                    meta: {
                        title: 'fields',
                    },
                    params: undefined,
                },
            ],
        },
    },
    {
        path: '/api',
        name: 'api',
        meta: {
            title: 'api',
        },
        component: GroupPage,
        children: [
            {
                path: '/api:catch(.*)',
                name: '404_catch_api',
                meta: {
                    title: '404_catch_api',
                    // componentName: '/Errors/Error404Page',
                },
                // component: importComponentCb('/Errors/Error404Page')
                component: Error404Page
            },
            {
                path: '/api/apis',
                name: 'api_apis',
                meta: {
                    title: 'apis'
                },
                component: GroupPage,
                children: [
                    {
                        path: '/api/apis/list',
                        name: 'api_apis_list',
                        meta: {
                            title: 'list',
                            componentName: '/api/apis/ListPage'
                        },
                        component: importComponentCb('/api/apis/ListPage')
                    },
                    {
                        path: '/api/apis:catch(.*)',
                        name: 'redirect_catch_api_apis',
                        redirect: {
                            name: 'api_apis_list',
                            params: undefined
                        },
                    },
                    {
                        path: '/api/apis',
                        name: 'redirect_api_apis',
                        redirect: {
                            name: 'api_apis_list',
                            params: undefined
                        },
                    }
                ],
                redirect: {
                    name: 'api_apis_list',
                    params: undefined
                }
            },
            {
                path: '/api/endpoints',
                name: 'api_endpoints',
                meta: {
                    title: 'endpoints'
                },
                component: GroupPage,
                children: [
                    {
                        path: '/api/endpoints/list',
                        name: 'api_endpoints_list',
                        meta: {
                            title: 'list',
                            componentName: '/api/endpoints/ListPage'
                        },
                        component: importComponentCb('/api/endpoints/ListPage')
                    },
                    {
                        path: '/api/endpoints:catch(.*)',
                        name: 'redirect_catch_api_endpoints',
                        redirect: {
                            name: 'api_endpoints_list',
                            params: undefined
                        },
                    },
                    {
                        path: '/api/endpoints',
                        name: 'redirect_api_endpoints',
                        redirect: {
                            name: 'api_endpoints_list',
                            params: undefined
                        },
                    }
                ],
                redirect: {
                    name: 'api_endpoints_list',
                    params: undefined
                }
            }
        ]
    }
]