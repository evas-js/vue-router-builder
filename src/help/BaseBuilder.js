/**
 * Базовый клас сборщиков роута и роутера.
 * @package @evas-js/vue-router-builder
 * @author Egor Vasyakin <egor@evas-php.com>
 * @license CC-BY-4.0
 */

import { concatPath } from "./functions.js"

export class BaseBuilder {
    _children = []
    _path
    _dir
    _prefix
    _postfix

    path(value) {
        this._path = concatPath(this._parent?._path, value)
        return this
    }
    dir(value) {
        this._dir = concatPath(this._parent?._dir, value)
        return this
    }
    prefix(value) {
        this._prefix = value
        return this
    }
    postfix(value) {
        this._postfix = value
        return this
    }
}
