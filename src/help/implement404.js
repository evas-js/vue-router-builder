/**
 * Расширение поддержкой установки 404 страниц.
 * @package @evas-js/vue-router-builder
 * @author Egor Vasyakin <egor@evas-php.com>
 * @license CC-BY-4.0
 */

import { getRouteWithCatch } from "./functions.js"
import { BaseBuilder } from "./BaseBuilder.js"
import { fromPathToCase, toSnakeCase } from "../../helper-methods/string/cases.js"

export function implement404(builder) {
    /**
     * Установка 404.
     * @param { String|Object } component путь к компоненту или компонет
     * @return this
     */
    builder.prototype.set404 = function (component = BaseBuilder.page404) {
        this._set404 = true
        const path = this._path
        const name = '404_catch_' + fromPathToCase(path, toSnakeCase)
        const meta = { title: name }
        // console.log('\x1b[45m' + ' 404 ' + '\x1b[0m', '\x1b[35m' + path + '\x1b[0m')
        return this.child(getRouteWithCatch({ path, name, meta, component }))
    }

    /**
     * Глубокая установка 404.
     * @param { String|Object } component путь к компоненту или компонет
     * @return this
     */
    builder.prototype.set404Deep = function (component = BaseBuilder.page404) {
        this._set404Deep = component
        return this._parent?._set404Deep ? this : this.set404(component)
    }
    /**
     * Выключение глубокой установки 404.
     * @return this
     */
    builder.prototype.unset404Deep = function () {
        this._set404Deep = false
        return this
    }
    /**
     * Проверка на mode404.
     * @return { Boolean }
     */
    builder.prototype.isset404 = function () {
        return this._set404 || this._set404Deep
    }

}
