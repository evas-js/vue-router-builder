/**
 * Расширение поддержкой дочерних роутов.
 * @package @evas-js/vue-router-builder
 * @author Egor Vasyakin <egor@evas-php.com>
 * @license CC-BY-4.0
 */

import { logErrorIfHasValue, prepareLogWithPath } from "./functions.js"
import { RouteBuilder } from "../RouteBuilder.js"

export function implementChildren(builder) {
    /**
     * Добавление дочернего роута
     * @param { String|Object|RouteBuilder } child путь или роут
     * @param { Function|null } колбэк для настройки роута или null
     * @returns this
     */
    builder.prototype.child = function (child) {
        if (typeof child === 'string') child = new RouteBuilder(this, ...arguments)
        if (child && typeof child === 'object') {
            if (child instanceof RouteBuilder) child = child.build()
            if (typeof child.path !== 'string') throw new Error('child path must be a string, given: ' + child.path)
            // console.log(...prepareLogWithPath('pushChild', child.path))
            this._children.push(child)
        }
        else logErrorIfHasValue('Child must be an instanceof RouteBuilder or object', child)
        return this
    }

    builder.prototype.page = function (path, cb) {
        // console.groupCollapsed(...prepareLogWithPath('page()', path))
        this.child(path, route => {
            if (typeof cb === 'function') cb(route)
            else logErrorIfHasValue('Route cb must be a function', cb)
            if (!route._component) route.component(path)
        })
        // console.groupEnd()
        return this
    }

    builder.prototype.group = function (path, cb, { dir = false, withNav = false} = {}) {
        // console.groupCollapsed(...prepareLogWithPath('group()', path))
        this.child(path, route => {
            if (dir) route.dir(typeof dir === 'string' ? dir : path)
            route.component(RouteBuilder.groupPage)
        
            if (typeof cb === 'function') cb(route)
            else logErrorIfHasValue('Route cb must be a function', cb)
            if (withNav) route.withNav()
        })
        // console.groupEnd()
        return this
    }
    builder.prototype.groupWithDir = function (path, cb, options) {
        return this.group(path, cb, { ...options, dir: options?.dir || true })
    }
    builder.prototype.groupWithNav = function (path, cb, options) {
        return this.group(path, cb, { ...options, withNav: true })
    }
    builder.prototype.groupWithDirAndNav = function (path, cb, options) {
        return this.group(path, cb, { ...options, dir: true, withNav: true })
    }


    builder.prototype.eachRoutes = function (handler, ...routes) {
        const handle = routes => {
            if (!routes) return console.error('routes/route is empty')
            if (typeof routes !== 'object') handler.call(this, routes)
            else if (Array.isArray(routes)) {
                if (routes.some(item => ['function', 'object'].includes(typeof item) && !Array.isArray(item))) {
                    handler.call(this, ...routes)
                } else {
                    routes.forEach(path => path && handler.call(this, ...[path].flat()))
                }
            }
            else Object.entries(routes).forEach(([path, cb]) => handler.call(this, path, ...[cb].flat()))
        }
        routes.forEach(handle)
        return this
    }
    
    builder.prototype.pages = function () {
        return this.eachRoutes(this.page, ...arguments)
    }

    builder.prototype.groups = function () {
        return this.eachRoutes(this.group, ...arguments)
    }
    builder.prototype.groupsWithDir = function () {
        return this.eachRoutes(this.groupWithDir, ...arguments)
    }
    builder.prototype.groupsWithNav = function () {
        return this.eachRoutes(this.groupWithNav, ...arguments)
    }
    builder.prototype.groupsWithDirAndNav = function () {
        return this.eachRoutes(this.groupWithDirAndNav, ...arguments)
    }
}
