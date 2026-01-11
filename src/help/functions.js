/**
 * Вспомогательные методы.
 * @package @evas-js/vue-router-builder
 * @author Egor Vasyakin <egor@evas-php.com>
 * @license CC-BY-4.0
 */

/**
 * Обрезка повторяющихся символов.
 * Символ будет встречаться не более 1 раза подряд
 * @param { String|Array } value строка или массив строк
 * @param { String|Array } symbol символ или массив символов
 * @return { String } строка без повторяющихся символов
 */
export function onceSymbol(value, symbol) {
    if (Array.isArray(value)) return value.map(val => onceSymbol(val, symbol))
    if (Array.isArray(symbol)) return symbol.reduce((val, sym) => onceSymbol(val, sym), value)
    return value?.replace(new RegExp(symbol + '+', 'g'), symbol) ?? ''
}

/**
 * Обрезка повторяющихся слэшей.
 * @param { String }
 * @return { String }
 */
export const onceSlashes = (value) => onceSymbol(value, '/')

/**
 * Склейка массива частей пути в один путь.
 * @param { ...String[] } values части пути
 * @return { String }
 */
export const concatPath = (...values) => onceSlashes(values.flat(Infinity).join('/'))

/**
 * Получение копии роута с постфиксами _catch.
 * @param { Object } route роут
 * @param { String|null } regexp регулярное выражение для catch 
 * @return { Object } роут с постфиксами _catch
 */
export const getRouteWithCatch = function (route, regexp = '.*') {
    return {
        ...route,
        path: route.path + `:catch(${regexp})`,
    }
}

// проверка на наличие значения (не undefined и не null)
export const hasValue = (value) => ![undefined, null].includes(value)
// логгирование ошибки, если значение есть (используется если тип значения не соответствует)
export const logErrorIfHasValue = (msg, value) => hasValue(value) && console.error(msg, value)
// подготовка пути для логгирования
export const prepareLogWithPath = (msg, path) => {
    if (typeof __dirname !== 'undefined') return [msg, '\x1b[36m', path, '\x1b[0m']
    else return ['%s %c %s %c', msg, 'color: #7fdc', path, '']
}
