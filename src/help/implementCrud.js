/**
 * Расширение поддержкой установки CRUD роутов.
 * @package @evas-js/vue-router-builder
 * @author Egor Vasyakin <egor@evas-php.com>
 * @license CC-BY-4.0
 */

import { toPascalCase } from "../../helper-methods/string/cases.js"
import { prepareLogWithPath } from "./functions.js"

export function implementCrud(builder) {
    builder.prototype.actionsWithId = ['show', 'edit']
    /**
     * Добавление СRUD страницы.
     * @param { String } entity имя модели
     * @param { String } action имя действия
     * @return this
     */
    builder.prototype.crudPage = function (entity, action, { 
        isUnified = false, 
        idForce = false,
        idPattern = '.*',
        idMultiple = false,
    } = {}) {
        console.groupCollapsed(...prepareLogWithPath('crudPage()', path))
        let path = `:action(${action})`
        if (!idForce && this.actionsWithId.includes(action)) {
            path += `/:id(${idPattern})`
            if (idMultiple) path += '*'
        }
        entity = toPascalCase(entity)
        this.child(path, route => {
            route.name(`${entity}_${action}`)
            route.addMeta('entity', entity)
            route.addMeta('action', action)
            route.title(entity + ' ' + action)
            route.component(entity + toPascalCase(isUnified && action !== 'list' ? 'one' : action))
            route.addProp('entity', entity)
            route.addProp('action', action)
        })
        console.groupEnd()
        return this
    }

    builder.prototype.crudPages = function (entity, actions, options) {
        if (actions && typeof actions === 'object') {
            if (Array.isArray(actions)) {
                actions.forEach(action => this.crudPage(entity, action, options))
            } else {
                Object.entries(actions).forEach(
                    (action, actionOptions) => this.crudPage(entity, action, actionOptions || options)
                )
            }
        } else logErrorIfHasValue(actions, 'crudPages actions must be an array.')
        return this
    }
}
