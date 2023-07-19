const XlsxPopulate = require('xlsx-populate')

const excelEpoc = new Date(1900, 0, -1).getTime()
const msDay = 86400000

//Utils
const getNumRows = (wb, sheet) => {
    const rows = wb.sheet(sheet).usedRange().value()
    return Array.from(rows).length
}

const rangeToNull = r => {
    r.forEach(cell => {
        if (cell.value() === undefined) {
            cell.value('null')
        }
    })
}

const formatDate = numDate => {
    const date = new Date(excelEpoc + numDate * msDay)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')

    return `${year}-${month}-${day}`
}

const rangeCpbFec = (c, r) => {
    const valueArr = []

    c.forEach(cell => {
        valueArr.push(cell.value())
    })

    r.forEach((cell, i) => {
        cell.value(formatDate(valueArr[i]))
    })
}

const insertFormulas = (r, name) => {
    r.forEach((cell, i) => {
        cell.formula(`="INSERT INTO gasto(pcg_anio, pcg_mes, gas_proyecto, gas_item_s, gas_glosa, gas_monto, dea_cuenta_s, gas_detalle, gas_proveedor, gas_fecha, gas_debe, gas_haber, gas_monto_uf, dep_codigo, gas_tipo, gas_numero, gas_ordencompra, rut_emp) VALUES (2020, 9,'"&${name}!G${i + 2}&"', '"&${name}!H${i + 2}&"','"&${name}!S${i + 2}&"',  "&${name}!V${i + 2}&",'"&${name}!B${i + 2}&"', '"&${name}!S${i + 2}&"', '"&${name}!K${i + 2}&"', '"&${name}!AC${i + 2}&"', "&${name}!T${i + 2}&", "&${name}!U${i + 2}&", NULL, NULL, '"&${name}!L${i + 2}&"', "&${name}!P${i + 2}&","&${name}!Q${i + 2}&", '"&${name}!A${i + 2}&"');"`)
    })
}

//Main functions
const fillNulls = (wb, regs) => {
    const consultoriaRange = wb.sheet('CONSULTORIA').range(`P1:Q${regs.consultoria}`)
    const ingenieriaRange = wb.sheet('INGENIERIA').range(`P1:Q${regs.ingenieria}`)
    const ambientalRange = wb.sheet('AMBIENTAL').range(`P1:Q${regs.ambiental}`)

    rangeToNull(consultoriaRange)
    rangeToNull(ingenieriaRange)
    rangeToNull(ambientalRange)
}

const formatCpbFec = (wb, regs) => {
    const consultoriaSheet = wb.sheet('CONSULTORIA')
    const consultoriaColumn = consultoriaSheet.range(`N2:N${regs.consultoria}`)
    const consultoriaResColumn = consultoriaSheet.range(`AC2:AC${regs.consultoria}`)
    rangeCpbFec(consultoriaColumn, consultoriaResColumn)

    const ingenieriaSheet = wb.sheet('INGENIERIA')
    const ingenieriaColumn = ingenieriaSheet.range(`N2:N${regs.ingenieria}`)
    const ingenieriaResColumn = ingenieriaSheet.range(`AC2:AC${regs.ingenieria}`)
    rangeCpbFec(ingenieriaColumn, ingenieriaResColumn)

    const ambientalSheet = wb.sheet('CONSULTORIA')
    const ambientalColumn = ambientalSheet.range(`N2:N${regs.ambiental}`)
    const ambientalResColumn = ambientalSheet.range(`AC2:AC${regs.ambiental}`)
    rangeCpbFec(ambientalColumn, ambientalResColumn)
}

const createSheets = wb => {
    wb.addSheet('CARGA_CONS')
    wb.addSheet('CARGA_ING')
    wb.addSheet('CARGA_AMB')

    wb.moveSheet('CARGA_CONS', 1)
    wb.moveSheet('CARGA_ING', 3)
    wb.moveSheet('CARGA_AMB', 5)
}

const createInserts = (wb, regs) => {
    const consultoriaSheet = wb.sheet('CARGA_CONS')
    const consultoriaColumn = consultoriaSheet.range(`A2:A${regs.consultoria}`)
    insertFormulas(consultoriaColumn, 'CONSULTORIA')

    const ingenieriaSheet = wb.sheet('CARGA_ING')
    const ingenieriaColumn = ingenieriaSheet.range(`A2:A${regs.ingenieria}`)
    insertFormulas(ingenieriaColumn, 'INGENIERIA')

    const ambientalSheet = wb.sheet('CARGA_AMB')
    const ambientalColumn = ambientalSheet.range(`A2:A${regs.ambiental}`)
    insertFormulas(ambientalColumn, 'AMBIENTAL')
}

XlsxPopulate.fromFileAsync('./GL.xlsx')
    .then(wb => {
        const regs = {
            consultoria: getNumRows(wb, 'CONSULTORIA'),
            ingenieria: getNumRows(wb, 'INGENIERIA'),
            ambiental: getNumRows(wb, 'AMBIENTAL')
        }

        fillNulls(wb, regs)
        formatCpbFec(wb, regs)
        createSheets(wb)
        createInserts(wb, regs)

        return wb.toFileAsync('./GL_Output.xlsx')
    })