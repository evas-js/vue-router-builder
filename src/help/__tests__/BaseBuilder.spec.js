/**
 * Тесты базового класса сборщиков роутера и роута.
 * @package @evas-js/vue-router-builder
 * @author Egor Vasyakin <egor@evas-php.com>
 * @license CC-BY-4.0
 */

import { describe, it, expect } from 'vitest'
import { BaseBuilder } from '../BaseBuilder.js'

describe('BaseBuilder', () => {
    it('path, dir, prefix, postfix', () => {
        const res = (new BaseBuilder)
        .path('/test')
        .dir('/test/')
        .prefix('prefix')
        .postfix('postfix')
        expect(res._path).toBe('/test')
        expect(res._dir).toBe('/test/')
        expect(res._prefix).toBe('prefix')
        expect(res._postfix).toBe('postfix')
    })
})
