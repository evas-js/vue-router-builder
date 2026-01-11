export { expectedRoutes } from './expectedRoutes.js'
export { expectedSidebar } from './expectedSidebar.js'

import { RouterBuilder } from "../../../RouterBuilder.js"

export const example = [
    // 1.1
    (new RouterBuilder)
    .group('storage', route => {
        route.dir('storage')
        route.group('models', route => {
            route.prefix('Model')
            route.page('list')
            route.withNav()
        })
        route.group('fields', route => {
            route.dir('fields')
            route.page('list')
        })
        route.withNav()
    })
    .group('api', route => {
        route.set404()
        // route.set404Deep()
        route.dir('api')
        route.group('apis', route => {
            // route.set404()
            route.dir('apis')
            route.page('list')
            // route.group('test', route => {
            //     route.page('kek')
            // })
        })
        route.group('endpoints', route => {
            route.dir('endpoints')
            route.page('list')
        })
    }),

    // 1.2
    (new RouterBuilder)
    .groupWithDirAndNav('storage', route => {
        route.groupWithNav('models', route => {
            route.prefix('Model')
            route.page('list')
        })
        route.groupWithDir('fields', route => {
            route.page('list')
        })
    })
    .groupWithDir('api', route => {
        route.set404()
        route.groupWithDir('apis', route => {
            route.page('list')
        })
        route.groupWithDir('endpoints', route => {
            route.page('list')
        })
    }),

    // 1.3
    (new RouterBuilder)
    .groupsWithDir([
        ['storage', route => {
            route.groupWithNav('models', route => {
                route.prefix('Model')
                route.page('list')
            })
            route.groupWithDir('fields', route => {
                route.page('list')
            })
        }, { withNav: true }],
        ['api', route => {
            route.set404()
            route.groupsWithDir([
                ['apis', route => {
                    route.page('list')
                }],
                ['endpoints', route => {
                    route.page('list')
                }]
            ])
        }]
    ]),

    // 1.4
    (new RouterBuilder)
    .groupsWithDir([
        ['storage', route => {
            route.groups([
                [
                    'models', 
                    route => { route.prefix('Model').page('list') }, 
                    { withNav: true }
                ],
                [
                    'fields', 
                    route => { route.page('list') }, 
                    { dir: true }
                ]
            ])
        }, { withNav: true }],
        ['api', route => {
            route.set404()
            route.groupsWithDir([
                ['apis', route => { route.page('list') }],
                ['endpoints', route => { route.page('list') }]
            ])
        }]
    ]),

    // 1.5
    (new RouterBuilder)
    .groupsWithDir({
        'storage': [
            route => {
                route.groups([
                    [
                        'models', 
                        route => { route.prefix('Model').page('list') }, 
                        { withNav: true }
                    ],
                    [
                        'fields', 
                        route => { route.page('list') }, 
                        { dir: true }
                    ]
                ])
            }, 
            { withNav: true }
        ],
        'api': route => {
            route.set404()
            route.groupsWithDir([
                ['apis', route => { route.page('list') }],
                ['endpoints', route => { route.page('list') }]
            ])
        }
    }),

    // 1.6
    (new RouterBuilder)
    .groupWithDirAndNav('storage', route => {
        route.groupWithNav('models', route => {
            route.prefix('Model')
            route.page('list')
        })
        route.groupWithDir('fields', route => {
            route.page('list')
        })
    })
    .groupWithDir('api', route => {
        route.set404()
        route.groupsWithDir({
            'apis': route => route.page('list'),
            'endpoints': route => route.page('list')
        })
    }),
]