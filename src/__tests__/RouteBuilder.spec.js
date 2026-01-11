/**
 * Тесты сборщика роута.
 * @package @evas-js/vue-router-builder
 * @author Egor Vasyakin <egor@evas-php.com>
 * @license CC-BY-4.0
 */

import { describe, it, expect } from 'vitest'
import { RouteBuilder } from '../RouteBuilder.js'
import { fromPathToCase, toSnakeCase } from '../../helper-methods/string/cases.js'
import { RouterBuilder } from '../RouterBuilder.js'

const defaults = {
    path: '/test',
    name: 'test',
    title: 'test title',
    component: 'TestPage',
}
const setDefaults = (builder, params = {}) => {
    Object.entries({ ...defaults, ...params }).forEach(([key, val]) => {
        builder[key]?.(val)
    })
    return builder
}
const makeWithDefaults = (params = {}) => {
    return setDefaults(new RouteBuilder, params)
}
const testEqualDefaults = (actual, params = {}) => {
    return Object.entries({ ...defaults, ...params }).forEach(([key, val]) => {
        const actualValue = key === 'title' ? actual.meta.title : actual[key]
        return actualValue === val
    })
}

const testRedirects = (route) => {
    const latest = route.children.slice(route.children.length - 2)
    expect(latest[0].path).toBe(route.path + ':catch(.*)')
    expect(latest[0].name).toBe('redirect_catch_' + fromPathToCase(route.path, toSnakeCase))
    expect(latest[1].path).toBe(route.path)
    expect(latest[1].name).toBe('redirect_' + fromPathToCase(route.path, toSnakeCase))
}

new RouterBuilder

describe('RouteBuilder', () => {
    it('path, name, title, component', () => {
        const res = makeWithDefaults().build()
        // expect(isEqualDefaults(res)).toBeTruthy()
        expect(res.path).toBe('/test')
        expect(res.name).toBe('test')
        expect(res.meta.title).toBe('test title')
        expect(res.meta.componentName).toBe('/' + 'TestPage')
        expect(res.children).toBeUndefined()
    })
    it('children', () => {
        const builder = makeWithDefaults()
        builder.child(makeWithDefaults())
        const res = builder.build()
        expect(res.children).toBeDefined()
        expect(res.children[0].path).toBe('/test')
        expect(res.children[0].name).toBe('test')
        expect(res.children[0].meta.title).toBe('test title')
        expect(res.children.length).toBe(3)
        testRedirects(res)
    })
    it('propertiesInheritance', () => {
        const res = makeWithDefaults({
            prefix: 'prefix',
            postfix: 'postfix',
        })
        .child('child', route => route.component('ChildPage'))
        .build()
        // console.log('LOG', res)
        expect(res.children[0].meta.componentName).toBe('/' + 'prefix' + 'ChildPage' + 'postfix')
    })
})
