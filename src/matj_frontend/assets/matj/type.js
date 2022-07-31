
function myNaN(a) {
    return isNaN(a) && typeof (a) == 'number'
}

function isRational(n) {
    return Math.abs(n) % 1 == 0
}


function isNda(a) {
    return a instanceof ndarray.create
}

function isComplex(a) {
    return a instanceof Complex
}

function isBigint(n) {
    return typeof (n) == 'bigint'
}

function isBoolean(n) {
    return typeof (n) == 'boolean'
}

function isTypeArray(n) {
    return n && /int|float/i.test(n.type)
}

function isArray(a) {
    return Array.isArray && Array.isArray(a) || isTypeArray(a) ///Array/.test(Object.prototype.toString.call(a)) ||
}

function isFraction(a) {
    return a instanceof Fraction
}

function myType(z) {
    if (isNda(z)) {
        return 'ndarray'
    }
    if (isComplex(z)) {
        return 'complex'
    }
    if (isFraction(z)) {
        return 'fraction'
    }
    if (isArray(z)) {
        return 'array'
    }

    return 'normal'
    /*
    null
    number
    string
    array
        array
        typearray
        intX
        uintX
        float
        single
        double
    object
    function
    regexp
    
    nda
    complex
    fraction
    
    
    referenceError
        */
}