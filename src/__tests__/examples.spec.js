/**
 * Тест примеров установки роутов.
 * @package @evas-js/vue-router-builder
 * @author Egor Vasyakin <egor@evas-php.com>
 * @license CC-BY-4.0
 */

import { describe, it, expect } from 'vitest'
import { readdirSync } from 'fs'
import { join } from 'path'
import { RouterBuilder } from '../RouterBuilder'

function testRoutes(example, expectedRoutes) {
    it('getRoutes()', () => {
        expect(JSON.stringify(example.getRoutes())).toEqual(JSON.stringify(expectedRoutes))
    })
}
function testSidebar(example, expectedSidebar) {
    const sidebars = [expectedSidebar].flat()
    sidebars.forEach((sidebar, index) => {
        it(`getSidebar(${index + 1})`, () => {
            expect(example.getSidebar(index + 1)).toStrictEqual(sidebar)
        })
    })
}
function testIsValid(example, isValidExpectedRoutes, isValidExpectedSidebar) {
    it('\x1b[32m' + 'check is valid example ---' + '\x1b[0m', () => {
        // example must be an RouterBuilder object or an array of RouterBuilder objects
        expect(example && (Array.isArray(example) || example instanceof RouterBuilder)).toBeTruthy()
        // expected routes or sidebar must be array
        expect(isValidExpectedRoutes || isValidExpectedSidebar).toBeTruthy()
    })
}

async function testExample(file) {
    const { example, expectedRoutes, expectedSidebar } = await import(join(examplesDir, file, 'index.js'))
    const isNotEmptyArray = value => value && Array.isArray(value)
    const isValidExpectedRoutes = isNotEmptyArray(expectedRoutes)
    const isValidExpectedSidebar = isNotEmptyArray(expectedSidebar)
    describe('Example ' + file, () => testIsValid(example, isValidExpectedRoutes, isValidExpectedSidebar))
    const examples = [example].flat()
    examples.forEach((example, i) => {
        describe(`Example ${file}.${i + 1}`, async () => {
            if (isValidExpectedRoutes) testRoutes(example, expectedRoutes)
            if (isValidExpectedSidebar) testSidebar(example, expectedSidebar)
        })
    })
}
async function readExamples(examplesDir) {
    const files = readdirSync(examplesDir)
    for (let file of files) {
        await testExample(file)
    }
}

const examplesDir = join(__dirname, 'examples')
await readExamples(examplesDir)
