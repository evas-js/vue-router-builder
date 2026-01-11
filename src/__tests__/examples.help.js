/**
 * Вспомогательные методы для тестов примеров установки роутов.
 * @package @evas-js/vue-router-builder
 * @author Egor Vasyakin <egor@evas-php.com>
 * @license CC-BY-4.0
 */

import { RouteBuilder } from "../RouteBuilder"
import { concatPath } from "../help/functions"

export const importComponentCb = (component) => {
    const pageComponent = concatPath(RouteBuilder.pagesDir, component)
    const page404 = concatPath(RouteBuilder.pagesDir, RouteBuilder.page404)
    return component ? async () => {
        try { return await import(`@/${pageComponent}.vue`) } 
        catch (e) { return import(`@/${page404}.vue`) }
    } : () => import(`@/${page404}.vue`)
}
