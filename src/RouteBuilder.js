/**
 * Сборщик vue-роута.
 * @package @evas-js/vue-router-builder
 * @author Egor Vasyakin <egor@evas-php.com>
 * @license CC-BY-4.0
 */

import { fromPathToCase, toPascalCase, toSnakeCase } from "../helper-methods/string/cases.js"
import { concatPath, logErrorIfHasValue, prepareLogWithPath } from "./help/functions.js"

import { BaseBuilder } from "./help/BaseBuilder.js"
import { implement404 } from "./help/implement404.js"
import { implementChildren } from "./help/implementChildren.js"
import { implementCrud } from "./help/implementCrud.js"
import { implementRedirect } from "./help/implementRedirect.js"

export class RouteBuilder extends BaseBuilder {
    _parent
    _name
    _meta
    _component
    _props
    _withNav
    
    name(value) {
        this._name = value
        return this
    }
    meta(value) {
        this._meta = value
        return this
    }
    addMeta(key, value) {
        if (!this._meta) this._meta = {}
        this._meta[key] = value
        return this
    }
    title(value) {
        return this.addMeta('title', value)
    }
    resetDir(value) {
        this._dir = value
        return this
    }
    component(value) {
        this._component = value
        return this
    }
    props(value) {
        this._props = value
        return this
    }
    addProps(values) {
        return this.props(Object.assign(this._props ?? {}, values))
    }
    addProp(key, value) {
        return this.addProps({ [key]: value })
    }
    withNav(value = true) {
        // console.log('set withNav', value)
        this._withNav = value
        return this
    }

    propertiesInheritance(parent) {
        ['prefix', 'postfix', 'set404Deep'].forEach(key => {
            if (parent[`_${key}`]) this[key](parent[`_${key}`])
        })
    }

    /**
     * @param { RouteBuilder } parent родительский сборщик
     * @param { String } path путь роута
     * @param { Function } cb колбэк сборки роута
     */
    constructor(parent, path, cb) {
        super()
        // console.log('\x1b[43m' + ' route ' + '\x1b[0m', '\x1b[33m' + path + '\x1b[0m')
        this._parent = parent
        if (parent) this.propertiesInheritance(parent)
        this.dir()
        if (typeof path === 'string') {
            this.path(path)
            this.title(fromPathToCase(path, toSnakeCase))
            this.name(fromPathToCase(this._path, toSnakeCase))
        }
        else logErrorIfHasValue('route path must be a string.', path)
        if (typeof cb === 'function') cb(this)
        else logErrorIfHasValue('route callback must be a function.', cb)
    }

    getImport404({ page404, pagesDir } = this.constructor) {
        const type = typeof page404
        if ('string' === type) {
            page404 = concatPath(pagesDir, page404)
            return () => import(`@/${page404}.vue`)
        } else if ('object' === type) {
            return () => page404
        } else {
            throw new Error('page404 must be a string or an object, given: ' + type)
        }
    }

    /**
     * Получение настройки динамической подгрузки страницы.
     * @param { String|null } component имя компонента
     */
    importComponentCb(component) {
        const pageComponent = concatPath(this.constructor.pagesDir, component)
        const import404 = this.getImport404()
        return component ? async () => {
            try { return await import(`@/${pageComponent}.vue`) } 
            catch (e) { return import404() }
        } : () => import404()
    }

    buildComponent({_component, _dir, _prefix, _postfix, _path } = this) {
        if (!_component) {
            throw new Error('Not has component for route: ' + _path)
        }
        const type = typeof _component
        if (type === 'string') {
            _component = concatPath(_dir, [_prefix, toPascalCase(_component), _postfix].join(''))
            // console.log('string component (dynamic)', _component)
            return [_component, this.importComponentCb(_component)]
        }
        else if (type === 'object') {
            // console.log('not string component (static)')
            return [null, _component]
        }
        else throw new Error(
            `Component for route ${this._path} must be a string path or an object, geven: ` + type
        )
    }

    setRedirectOr404() {
        if (!this._redirect) {
            if (!this.isset404()) this.redirectToFirst()
            // else if (!this._parent?.isset404()) this.set404()
            // else if (!this._parent?.()) this.set404()
        }
        if (this?.parent?._set404Deep) this.set404()
    }

    buildNavLinks() {
        if (!this._withNav) return
        // console.log('buildNavLinks')
        return this._children?.filter(({ meta }) => meta && !meta.entity).map(
            ({ path, name, meta, params }) => ({ path, name, meta, params })
        ) ?? []
    }

    /**
     * Сборка роута.
     * @returns { Object }
     */
    build() {
        // console.groupCollapsed(...prepareLogWithPath('build()', this._path))
        const result = {
            path: this._path,
            name: this._name,
            meta: Object.assign({ title: this._name }, this?._meta || {}),
        }
        // Компонент
        const [componentName, component] = this.buildComponent()
        result.component = component
        if (componentName) result.meta.componentName = componentName

        // Дочерние компоненты и редирект
        // result.props = route => ({ parent: route.parent })
        if (this._children.length) {
            // console.log('children', this._children)
            result.children = this._children
            this.setRedirectOr404()
        }
        if (this._redirect) result.redirect = this._redirect

        // Навигация и пропсы
        const links = this.buildNavLinks()
        if (links?.length) this.addProp('links', links)
        if (this._props) {
            // console.log('set props', this._props)
            result.props = this._props
        }

        // console.log('route result', result)
        // console.groupEnd()
        return result
    }
}

implementChildren(RouteBuilder)
implementCrud(RouteBuilder)
implementRedirect(RouteBuilder)
implement404(RouteBuilder)
