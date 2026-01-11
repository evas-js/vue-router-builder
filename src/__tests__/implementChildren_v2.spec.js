/**
 * Тесты установки дочерних роутов v2.
 * @package @evas-js/vue-router-builder
 * @author Egor Vasyakin <egor@evas-php.com>
 * @license CC-BY-4.0
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { RouterBuilder } from '../RouterBuilder'
import { checkChildObject, checkGroupExtra, checkGroups, checkGroupsExtra, checkPage, checkPages, makeChildObject, makeGroupExtra, makePage, replaceComponent, replaceNameAndTitle, replacedComponent, replacedNameAndTitle, setBuilderProps } from './help'
import { RouteBuilder } from '../RouteBuilder'

describe('implementChildren', () => {
    beforeEach(() => {
        this.builder = new RouterBuilder
    })
    it('child() object', () => {
        builder.child(makeChildObject('/child1'))
        const routes = builder.getRoutes()
        expect(routes.length).toBe(1)
        checkChildObject(routes[0])
    })
    it ('child() RouteBuilder', () => {
        builder.child(setBuilderProps(new RouteBuilder, makeChildObject('/child2')))
        const routes = builder.getRoutes()
        expect(routes.length).toBe(1)
        checkPage(routes[0])
    })
    it('page()', () => {
        builder.page('page1')
        builder.page('page2', replaceNameAndTitle)
        builder.page('page3', replaceComponent)
        const routes = builder.getRoutes()
        expect(routes.length).toBe(3)
        checkPages(routes[0], [routes[1], replacedNameAndTitle], [routes[2], replacedComponent])
    })
    
    it('group()', () => {
        builder.group('group1')
        builder.group('group2', replaceNameAndTitle)
        builder.group('group3', replaceComponent) // становится страницей
        const routes = builder.getRoutes()
        expect(routes.length).toBe(3)
        checkGroups(routes[0], [routes[1], replacedNameAndTitle])
        checkPage(routes[2], replacedComponent) // проверяем как страницу
    })

    it('group() with children', () => {
        // группа с 1 страницей внутри
        builder.group('group', route => route.page('page1'))
        // группа с 2 страницами + 1 группой со страницей + 1 страницей
        builder.group('group', route => {
            route.page('page1').page('page2').group('group1', route => route.page('page3')).page('page4')
        })
        const routes = builder.getRoutes()
        expect(routes.length).toBe(2)
        checkGroupExtra(routes[0], { children: [makePage('page1')] })
        checkGroupExtra(routes[1], { children: [
            makePage('page1'), makePage('page2'),
            makeGroupExtra('group1', { children: [makePage('page3')] }),
            makePage('page4'),
        ] })
    })
    const makeForCheckDeepRedirect = level => {
        const options = {}
        const childrenWithPage = { children: [makePage('page1')] }
        for (let i = 0; i < level; i++) {
            options
        }
    }
    it('group() check deep redirect', () => {
        // группа с 1 группой со страницей (глубокий редирект, через 1 уровень)
        builder.group('group', route => route.group('group1', route => route.page('page1')))
        // группа с 1 группой c 1 группой со страницей (глубокий редирект, через 2 уровня)
        builder.group('group', route => route.group('group1', route => route.group('group2', route => route.page('page1'))))
        const routes = builder.getRoutes()
        expect(routes.length).toBe(2)
        checkGroupsExtra(
            [ routes[0], { children: [
                makeGroupExtra('group1', { children: [makePage('page1')] })
            ] }],
            // [ routes[1], { children: [
            //     makeGroupExtra('group1', { children: [
            //         makeGroupExtra('group2', { children: [makePage('page1')] })
            //     ] })
            // ] }]
        )
        /** @todo тест не работает (надо доработать установку родительских имён в setParentPathForChildren): */
        // checkGroupExtra(routes[1], { children: [
        //     makeGroupExtra('group1', { children: [
        //         makeGroupExtra('group2', { children: [makePage('page1')] })
        //     ] })
        // ] })
    })
    it('group() with options { dir }', () => {})
    it('group() with options { withNav }', () => {})
    it('group() with options { dir, withNav }', () => {})
    
    it('groupWithDir()', () => {})
    it('groupWithNav()', () => {})
    it('groupWithDirAndNav()', () => {})
    
    it('pages()', () => {})

    it('groups()', () => {})
    it('groupsWithDir()', () => {})
    it('groupsWithNav()', () => {})
    it('groupsWithDirAndNav()', () => {})

})
