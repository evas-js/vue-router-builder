/**
 * Вспомогательные методы для тестов.
 * @package @evas-js/vue-router-builder
 * @author Egor Vasyakin <egor@evas-php.com>
 * @license CC-BY-4.0
 */

import { expect } from "vitest"
import { concatPath } from "../help/functions"
import { fromPathToCase, toPascalCase, toSnakeCase } from "../../helper-methods/string/cases"
import GroupPage from "../components/GroupPage.vue"

function deepMerge(target, source) {
    const isObject = val => val && typeof val === 'object' && !Array.isArray(val)
    const every = (arr, check) => arr.every(val => check(val))
    for (const key in source) {
        if (!source.hasOwnProperty(key)) continue
        const from = source[key], to = target[key]
        if (every([from, to], isObject)) deepMerge(to, from)
        else if (every([from, to], Array.isArray)) target[key] = to.concat(from)
        else target[key] = from
    }
    return target
}

const getPathLastPart = path => path.split('/').at(-1)
const makePath = path => concatPath('/', path)
const makeName = path => fromPathToCase(path, toSnakeCase)
const makeComponent = path => concatPath('/', fromPathToCase(getPathLastPart(path), toPascalCase) + 'Page')
const makeTitle = path => fromPathToCase(getPathLastPart(path), toSnakeCase)

export const setBuilderProps = (target, props = {}) => Object.entries(props).reduce((b, [k, v]) => b[k]?.(v), target)

export const makeChildObject = path => ({
    path: makePath(path),
    name: makeName(path),
    component: makeComponent(path)
})

export const makePage = (path, custom) => deepMerge({
    path: makePath(path),
    name: makeName(path),
    meta: { title: makeTitle(path), componentName: makeComponent(path) },
    component: async () => {},
}, custom)

export const makeGroup = (path, custom) => deepMerge({
    path: makePath(path),
    name: makeName(path),
    meta: { title: makeTitle(path) },
    component: GroupPage
}, custom)


const eachChildrenDeep = ({ children }, cb, level = 0) => {
    level++
    if (children?.length) children.forEach((child, i) => { cb(child, level, i); eachChildrenDeep(child, cb, level) })
}
const findFirstDeep = (route, filter) => {
    const first = route.children?.filter(child => filter ? filter?.(child) : true).at(0)
    return first ? findFirstDeep(first) : route
}
const makeRedirect = (path, to, isCatch = false) => ({
    path: makePath(path) + (isCatch ? ':catch(.*)' : ''),
    name: 'redirect_' + (isCatch ? 'catch_' : '') + makeName(path),
    redirect: to
})
const makeRedirects = (path, to) => ([
    // { path: makePath(path) + ':catch(.*)', name: 'redirect_catch_' + makeName(path), redirect: to },
    // { path: makePath(path), name: 'redirect_' + makeName(path), redirect: to }
    makeRedirect(path, to, true),
    makeRedirect(path, to)
])
const makeNavLinks = (...routes) => ({
    links: [routes].flat(Infinity).map(({ path, name, meta, params }) => ({ path, name, meta, params }))
})

export const makeGroupExtra = (path, { dir = false, withNav = false, redirect, ...custom } = {}) => {
    const props =  withNav ? makeNavLinks(custom.children) : undefined
    if (custom.children?.length) {
        if (dir) {
            const prefix = (dir === true ? makeName(path) : dir)
            eachChildrenDeep(custom, ({ meta }) => {
                if (meta?.componentName) meta.componentName = '/' + concatPath(prefix, meta.componentName)
            })
        }
        if (!redirect) redirect = { name: findFirstDeep(custom).name }
        makeRedirects(makePath(path), redirect).forEach(child => custom.children.push(child))
    }
    return makeGroup(path, { ...custom, redirect, props })
}
const setParentPathForChildren = (group) => {
    if (!group.children?.length) return group
    const pathsByLevels = [makePath(group.path)]
    const makeRedirectTo = (route, level) => ({
        name: makeName(concatPath(pathsByLevels.slice(0, level), route.redirect.name))
    })
    const updateRedirectRoute = (route, level) => {
        const path = makePath(concatPath(pathsByLevels.slice(0, level)))
        const isCatch = route.name.startsWith('redirect_catch_')
        const maked = makeRedirect(path, makeRedirectTo(route, level), isCatch)
        route.path = maked.path
        route.name = maked.name
        route.redirect = maked.redirect
        // deepMerge(route, maked)
    }
    eachChildrenDeep(group, (child, level) => {
        pathsByLevels[level] = child.path.split('/').at(-1)
        if (child.name.startsWith('redirect_')) {
            updateRedirectRoute(child, level)
        } else {
            child.path = makePath(concatPath(pathsByLevels.slice(0, level + 1)))
            child.name = makeName(child.path)
            if (child.redirect) child.redirect = makeRedirectTo(child, level + 1)
        }
    })
    if (group.redirect) {
        const redirect = { name: findFirstDeep(group).name }
        group.redirect = redirect
        group.children.forEach(child => child.name.startsWith('redirect_') && (child.redirect = redirect))
    }

    return group
}


const replaced = { name: 'another name', title: 'another title', component: 'another component' }
export const replaceNameAndTitle = route => route.name(replaced.name).title(replaced.title)
export const replaceComponent = route => route.component(replaced.component)
export const replacedNameAndTitle = { name: replaced.name, meta: { title: replaced.title }}
export const replacedComponent = { meta: { componentName: makeComponent(replaced.component) }}

export const checkChildObject = route => expect(route).toEqual(makeChildObject(route.path))
const jsonEqual = (actual, expected) => expect(JSON.stringify(actual)).toEqual(JSON.stringify(expected))
export const checkPage = (route, custom) => jsonEqual(route, makePage(route.path, custom))
export const checkGroup = (route, custom) => jsonEqual(route, makeGroup(route.path, custom))
export const checkGroupExtra = (route, custom) => jsonEqual(
    route, 
    setParentPathForChildren(makeGroupExtra(route.path, custom))
)

const checkRoutes = (handler, ...routes) => routes.forEach(route => handler(...[route].flat()))
export const checkPages = (...routes) => checkRoutes(checkPage, ...routes)
export const checkGroups = (...routes) => checkRoutes(checkGroup, ...routes)
export const checkGroupsExtra = (...routes) => checkRoutes(checkGroupExtra, ...routes)
