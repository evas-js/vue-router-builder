/**
 * Тесты установки дочерних роутов.
 * @package @evas-js/vue-router-builder
 * @author Egor Vasyakin <egor@evas-php.com>
 * @license CC-BY-4.0
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { RouterBuilder } from '../RouterBuilder.js'
import { fromPathToCase, toPascalCase, toSnakeCase } from '../../helper-methods/string/cases.js'
import { concatPath } from '../help/functions.js'
import { RouteBuilder } from '../RouteBuilder.js'
import GroupPage from '../components/GroupPage.vue'

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
const setBuilderProps = (target, props = {}) => Object.entries(props).reduce((b, [k, v]) => b[k]?.(v), target)
const makeChildObject = path => ({
    path: makePath(path),
    name: makeName(path),
    component: makeComponent(path)
})
const makePage = (path, custom) => deepMerge({
    path: makePath(path),
    name: makeName(path),
    meta: { title: makeTitle(path), componentName: makeComponent(path) },
    component: async () => {},
}, custom)
const makeGroup = (path, custom) => deepMerge({
    path: makePath(path),
    name: makeName(path),
    meta: { title: makeTitle(path) },
    component: GroupPage
}, custom)

const eachChildrenDeep = ({ children }, cb) => {
    if (children?.length) children.forEach((child, i) => { cb(child, i); eachChildrenDeep(child, cb) })
}
const findFirstDeep = route => {
    const first = route.children?.at(0)
    return first ? findFirstDeep(first) : route
}
const makeRedirects = (path, to) => ([
    { path: makePath(path) + ':catch(.*)', name: 'redirect_catch_' + makeName(path), redirect: to },
    { path: makePath(path), name: 'redirect_' + makeName(path), redirect: to }
])
const makeNavLinks = (...routes) => ({
    links: [routes].flat(Infinity).map(({ path, name, meta, params }) => ({ path, name, meta, params }))
})
// const makeGroupExtra = (path, { dir = false, withNav = false, redirect, ...custom } = {}) => {
function makeGroupExtra (path, { dir = false, withNav = false, redirect, ...custom } = {}) {
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

const replaced = { name: 'another name', title: 'another title', component: 'another component' }
const replaceNameAndTitle = route => route.name(replaced.name).title(replaced.title)
const replaceComponent = route => route.component(replaced.component)
const replacedNameAndTitle = { name: replaced.name, meta: { title: replaced.title }}
const replacedComponent = { meta: { componentName: makeComponent(replaced.component) }}

const checkChildObject = route => expect(route).toEqual(makeChildObject(route.path))
const jsonEqual = (actual, expected) => expect(JSON.stringify(actual)).toEqual(JSON.stringify(expected))
const checkPage = (route, custom) => jsonEqual(route, makePage(route.path, custom))
const checkGroup = (route, custom) => jsonEqual(route, makeGroup(route.path, custom))
const checkGroupExtra = (route, custom) => jsonEqual(route, makeGroupExtra(route.path, custom))

const checkRoutes = (handler, ...routes) => routes.forEach(route => handler(...[route].flat()))
const checkPages = (...routes) => checkRoutes(checkPage, ...routes)
const checkGroups = (...routes) => checkRoutes(checkGroup, ...routes)
const checkGroupsExtra = (...routes) => checkRoutes(checkGroupExtra, ...routes)

describe('implementChildren', () => {
    beforeEach(() => {
        this.builder = new RouterBuilder
    })

    it('child', () => {
        builder.child(makeChildObject('/child1'))
        builder.child(setBuilderProps(new RouteBuilder, makeChildObject('/child2')))
        const routes = builder.getRoutes()
        expect(routes.length).toBe(2)
        checkChildObject(routes[0])
        checkPage(routes[1])
    })


    it('page', () => {
        builder.page('page1')
        builder.page('page2', replaceNameAndTitle)
        builder.page('page3', replaceComponent)
        const routes = builder.getRoutes()
        expect(routes.length).toBe(3)
        checkPages(routes[0], [routes[1], replacedNameAndTitle], [routes[2], replacedComponent])
    })


    it('group', () => {
        builder.group('group1')
        builder.group('group2', replaceNameAndTitle)
        builder.group('group3', replaceComponent) // становится страницей
        const routes = builder.getRoutes()
        expect(routes.length).toBe(3)
        checkGroups(routes[0], [routes[1], replacedNameAndTitle])
        checkPage(routes[2], replacedComponent) // проверяем как страницу
    })


    it('group with children', () => {
        builder.group('group1', (route) => route.page('page1'))
        builder.group('group2', (route) => {
            route.page('page1').page('page2').group('group1', (route) => route.page('page3')).page('page4')
        })
        builder.group('group3', (route) => route.group('group1', (route) => route.page('page1')).page('page2'))
        
        const routes = builder.getRoutes()
        expect(routes.length).toBe(3)
        checkGroupExtra(routes[0], { children: [makePage('group1/page1')] })
        checkGroupExtra(routes[1], {
            children: [
                makePage('group2/page1'), makePage('group2/page2'),
                makeGroupExtra('group2/group1', { children: [makePage('group2/group1/page3')] }),
                makePage('group2/page4'),
            ]
        })
        checkGroupExtra(routes[2], {
            children: [
                makeGroupExtra('group3/group1', { children: [makePage('group3/group1/page1')] }),
                makePage('group3/page2')
            ],
        })
    })

    
    it('group with options', () => {
        builder.group('group1', (route) => route.page('page1'), { dir: true })
        builder.group('group2', (route) => route.page('page1'), { dir: 'something_dir' })
        builder.group('group5', null, { withNav: true }) // нет эффекта withNav, потому что нет элементов
        builder.group('group3', (route) => route.page('page1'), { withNav: true })
        builder.group('group4', (route) => route.group('group1').page('page1'), { withNav: true })
        builder.group('group6', (route) => route.group('group1').page('page1'), { dir: true, withNav: true })

        const groupWithChildGroup = ['group7', (route) => {
            route.group('group1', (route) => route.page('page1'), { dir: 'something_dir', withNav: true })
            .page('page2')
        }]
        builder.group(...groupWithChildGroup, { dir: true })
        builder.group(...groupWithChildGroup, { dir: true, withNav: true })

        const routes = builder.getRoutes()
        expect(routes.length).toBe(8)
        checkGroupsExtra(
            [routes[0], { children: [makePage('group1/page1')], dir: true }],
            [routes[1], { children: [makePage('group2/page1')], dir: 'something_dir' }],
            routes[2] /* нет эффекта, потому что нет элементов */,
            [routes[3], { children: [makePage('group3/page1')], withNav: true }],
            [routes[4], { children: [makeGroup('group4/group1'), makePage('group4/page1')], withNav: true }],
            [routes[5], { children: [makeGroup('group6/group1'), makePage('group6/page1')], dir: true, withNav: true }]
        )
        const forCheckGroupWithChildGroup = () => ({
            children: [
                makeGroupExtra('group7/group1', {
                    children: [ makePage('group7/group1/page1') ],
                    dir: 'something_dir', withNav: true
                }),
                makePage('group7/page2')
            ],
            dir: true
        })
        checkGroupExtra(routes[6], forCheckGroupWithChildGroup())
        checkGroupExtra(routes[7], { ...forCheckGroupWithChildGroup(), withNav: true })
    })


    it('groupWithDir', () => {
        builder.groupWithDir('group1')
        // автодиректория из пути
        builder.group('group2', (route) => route.page('page1'), { dir: true })
        builder.groupWithDir('group2', (route) => route.page('page1'))
        // заданная директория
        builder.group('group3', (route) => route.page('page1'), { dir: 'something_dir' })
        builder.groupWithDir('group3', (route) => route.page('page1'), { dir: 'something_dir' })
        
        const routes = builder.getRoutes()
        expect(routes.length).toBe(5)
        checkGroupsExtra(
            routes[0] /* нет эффекта, потому что нет элементов */,
            [routes[1], { children: [makePage('group2/page1')], dir: true }],
            [routes[2], { children: [makePage('group2/page1')], dir: true }],
            [routes[3], { children: [makePage('group3/page1')], dir: 'something_dir' }],
            [routes[4], { children: [makePage('group3/page1')], dir: 'something_dir' }],
        )
    })
    it ('groupWithNav', () => {
        builder.groupWithNav('group1')
        builder.groupWithNav('group2', (route) => route.page('page1'))
        const routes = builder.getRoutes()
        expect(routes.length).toBe(2)
        checkGroupsExtra(
            routes[0] /* нет эффекта, потому что нет элементов */,
            [routes[1], { children: [makePage('group2/page1')], withNav: true }]
        )
    })


    it('pages', () => {
        builder.pages(['page1', ['page2'], ['page3', replaceNameAndTitle]])
        expect(builder.getRoutes().length).toBe(3)

        builder.pages({ 'page4': replaceNameAndTitle, 'page5': [replaceNameAndTitle] })
        expect(builder.getRoutes().length).toBe(5)

        builder.pages(
            'page6', ['page7'], ['page8', replaceNameAndTitle], 
            { 'page9': replaceNameAndTitle, 'page10': [replaceNameAndTitle] }
        )
        expect(builder.getRoutes().length).toBe(10)

        const routes = builder.getRoutes()
        checkPages(...[0,1, 5,6].map(key => routes[key]))
        checkPages(...[2,3,4, 7,8,9].map(key => [routes[key], replacedNameAndTitle]))
    })


    it('groups', () => {
        builder.groups([
            'group1', ['group2'],
            ['group3', replaceNameAndTitle], ['group4', replaceComponent /* становится страницей */],
            ['group5', route => route.page('page1'), { dir: true, withNav: true }]
        ])
        expect(builder.getRoutes().length).toBe(5)

        builder.groups({
            'group6': replaceNameAndTitle, 'group7': replaceComponent /* становится страницей */,
            'group8': [replaceNameAndTitle], 'group9': [replaceComponent /* становится страницей */],
            'group10': [route => route.page('page1'), { dir: true, withNav: true }]
        })
        expect(builder.getRoutes().length).toBe(10)

        builder.groups(
            'group11', ['group12'],
            ['group13', replaceNameAndTitle], ['group14', replaceComponent /* становится страницей */],
            ['group15', route => route.page('page1'), { dir: true, withNav: true }],
            {
                'group16': replaceNameAndTitle, 'group17': replaceComponent /* становится страницей */,
                'group18': [replaceNameAndTitle], 'group19': [replaceComponent /* становится страницей */],
                'group20': [route => route.page('page1'), { dir: true, withNav: true }]
            }
        )
        expect(builder.getRoutes().length).toBe(20)

        const routes = builder.getRoutes()
        checkGroupsExtra(
            routes[0], routes[1], [routes[2], replacedNameAndTitle], 
            [routes[5], replacedNameAndTitle], [routes[7], replacedNameAndTitle],
            [routes[4], { children: [makePage('group5/page1')], dir: true, withNav: true }],
            [routes[9], { children: [makePage('group10/page1')], dir: true, withNav: true }],
            routes[10], routes[11], [routes[12], replacedNameAndTitle], 
            [routes[15], replacedNameAndTitle], [routes[17], replacedNameAndTitle],
            [routes[14], { children: [makePage('group15/page1')], dir: true, withNav: true }],
            [routes[19], { children: [makePage('group20/page1')], dir: true, withNav: true }],
        )
        checkPages( // проверяем как страницы
            [routes[3], replacedComponent], 
            [routes[6], replacedComponent], [routes[8], replacedComponent],
            [routes[13], replacedComponent], 
            [routes[16], replacedComponent], [routes[18], replacedComponent]
        )
    })


    it('group with options', () => {
    })

})
