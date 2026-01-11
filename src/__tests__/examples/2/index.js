export { expectedRoutes } from './expectedRoutes.js'

import { RouterBuilder } from "../../../RouterBuilder.js"

export const example = (new RouterBuilder())
// .group('storage', route => {
//     route.dir('storage')
//     route.group('models', route => {
//         route.prefix('Model')
//         route.singlePage('list')
//         route.withNav()
//     })
//     route.group('fields', route => {
//         route.dir('fields')
//         route.singlePage('list')
//     })
//     route.withNav()
// })
// .group('api', route => {
//     route.mode404()
//     route.dir('api')
//     route.group('apis', route => {
//         route.dir('apis')
//         route.singlePage('list')
//     })
//     route.group('endpoints', route => {
//         route.dir('endpoints')
//         route.singlePage('list')
//     })
// })
