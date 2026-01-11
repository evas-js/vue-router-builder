import { describe, it, expect, vi, afterAll } from 'vitest'
import { onceSlashes, concatPath, hasValue, logErrorIfHasValue, prepareLogWithPath, onceSymbol } from '../functions.js'

const hasValueItems = [0, '', '0', [], {}]
const notHasValueItems = [undefined, null]
/**
 * Тесты вспомогательных методов.
 * @package @evas-js/vue-router-builder
 * @author Egor Vasyakin <egor@evas-php.com>
 * @license CC-BY-4.0
 */

describe('functions', () => {
    const consoleMock = vi.spyOn(console, 'error').mockImplementation(() => undefined)
    afterAll(() => {
        consoleMock.mockReset()
    })
    it('onceSymbol', () => {
        expect(onceSymbol('//$$test////test////', '/')).toBe('/$$test/test/')
        expect(onceSymbol('//////&&&&&&$$test&&&/////%%%%', ['/', '&', '%'])).toBe('/&$$test&/%')
        expect(onceSymbol(['&&&&test\/', '//$$test'], ['/', '&'])).toEqual(['&test\/', '/$$test'])
    })
    it('onceSlashes', () => {
        expect(onceSlashes('//test//')).toBe('/test/')
        expect(onceSlashes('/////test///')).toBe('/test/')
        expect(onceSlashes('///test//test///')).toBe('/test/test/')
    })
    it('concatPath', () => {
        expect(concatPath('some', 'path')).toBe('some/path')
        expect(concatPath('some/', 'path')).toBe('some/path')
        expect(concatPath('some', '/path')).toBe('some/path')
        expect(concatPath('some/', '/path')).toBe('some/path')

        expect(concatPath(['some', 'path'])).toBe('some/path')
        expect(concatPath(['some/', 'path'])).toBe('some/path')
        expect(concatPath(['some', '/path'])).toBe('some/path')
        expect(concatPath(['some/', '/path'])).toBe('some/path')
    })
    it('hasValue', () => {
        notHasValueItems.forEach(value => expect(hasValue(value)).toBe(false))
        hasValueItems.forEach(value => expect(hasValue(value)).toBe(true))
    })
    it('logErrorIfHasValue', () => {
        const msg = (value) => `not has value ${value}`
        
        notHasValueItems.forEach(value => logErrorIfHasValue(msg(value), value))
        expect(consoleMock).toHaveBeenCalledTimes(0)

        hasValueItems.forEach(value => {
        logErrorIfHasValue(msg(value), value)
        expect(consoleMock).toHaveBeenCalledWith(msg(value), value)
        })
        expect(consoleMock).toHaveBeenCalledTimes(hasValueItems.length)
    })
    // it('prepareLogWithPath', () => {
    //     const makeExpected = (msg, path) => ['%s %c %s %c', msg, 'color: #7fdc', path, '']
    //     const msg = 'test message'
    //     const path = '/test/path'
    //     expect(prepareLogWithPath(msg, path)).toEqual(makeExpected(msg, path))
    // })
})
