/**
 * Сборщик vue-роутера.
 * @package @evas-js/vue-router-builder
 * @author Egor Vasyakin <egor@evas-php.com>
 * @license CC-BY-4.0
 */

import { createRouter, createWebHistory } from 'vue-router'
import { getEnv } from '@evas-js/helper-methods'

import { BaseBuilder } from './help/BaseBuilder.js'
import { implementChildren } from './help/implementChildren.js'
import { implementRedirect } from './help/implementRedirect.js'
import { implement404 } from './help/implement404.js'
import { implementCrud } from './help/implementCrud.js'

import GROUP_PAGE_DEFAULT from './components/GroupPage.vue'
import ERROR_404_PAGE_DEFAULT from './components/Error404Page.vue'

export class RouterBuilder extends BaseBuilder {
    constructor({ 
        basePath = getEnv('ROUTER_BASE_URL', getEnv('BASE_URL', '/')), 
        pagesDir = getEnv('ROUTER_PAGES_DIR', 'pages/'), 
        pagesPrefix = getEnv('ROUTER_PAGES_PREFIX', ''), 
        pagesPostfix = getEnv('ROUTER_PAGES_POSTFIX', 'Page'), 
        // page404 = getEnv('PAGE_404', 'errors/Error404Page'), 
        page404 = getEnv('ROUTER_PAGE_404', ERROR_404_PAGE_DEFAULT), 
        groupPage = getEnv('ROUTER_GROUP_PAGE', GROUP_PAGE_DEFAULT), 
    } = {}) {
        super()
        this.path(basePath)
        this.prefix(pagesPrefix)
        this.postfix(pagesPostfix)
        BaseBuilder.pagesDir = pagesDir
        BaseBuilder.page404 = page404
        BaseBuilder.groupPage = groupPage
    }

    build() {
        // console.group('build()')
        this.redirectToFirst()
        const routes = this.getRoutes()
        // console.log('routes', routes)

        const router = createRouter({
            history: createWebHistory(this._path),
            routes,
        })

        // console.groupEnd()
        return router
    }

    getRoutes() {
        return this._children
    }

    getSidebar(level = 1) {
        const getLinks = (item, level) => {
            level--
            return item
            .filter(({ name }) => !name?.startsWith('redirect_') && !name?.startsWith('404_'))
            .map(({ path, name, meta, children }) => {
                const route = { path, name, meta }
                if (level > 0 && children) {
                    route.children = getLinks(children, level)
                }
                return route
            })
        }
        return getLinks(this.getRoutes(), level)
    }
}

implementChildren(RouterBuilder)
implementCrud(RouterBuilder)
implementRedirect(RouterBuilder)
implement404(RouterBuilder)