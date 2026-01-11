/**
 * Расширение поддержкой редиректов.
 * @package @evas-js/vue-router-builder
 * @author Egor Vasyakin <egor@evas-php.com>
 * @license CC-BY-4.0
 */

import { fromPathToCase, toSnakeCase } from "../../helper-methods/string/cases.js"
import { getRouteWithCatch } from "./functions.js"

export function implementRedirect(builder) {
    /**
     * Установка редиректа на первый дочерний роут.
     * @return this
     */
    builder.prototype.redirectToFirst = function () {
        if (this._children?.length) this.redirectToFirstDeep(this._children[0])
        return this
    }
    builder.prototype.redirectToFirstDeep = function ({ name, path, params, children }) {
        if (children?.length) return this.redirectToFirstDeep(children[0])
        const props = { name, params }
        if (path.includes(':action')) {
            const action = path.includes(':action(show)') ? 'show' : 'list'
            props.params = { ...props.params, action }
        }
        return this.redirectTo(props)
    }

    /**
     * Установка редиректа.
     * @param { String|Object } redirect путь или объект роута
     * @return this
     */
    builder.prototype.redirectTo = function (redirect) {
        if (this._parent) this._redirect = redirect
        const path = this._path
        const name = fromPathToCase(path, toSnakeCase)
        const route = { path, name: 'redirect_' + name, redirect }
        // console.log('\x1b[45m' + ' redirect ' + '\x1b[0m', '\x1b[35m' + path + '\x1b[0m', 'to', '\x1b[31m' + (redirect?.name ?? redirect) + '\x1b[0m')
        if (!this.isset404()) this.child(getRouteWithCatch({ ...route, name: 'redirect_catch_' + name }))
        return this.child(route)
    }
}
