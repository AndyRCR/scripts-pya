const sqlRegex = /\$sql\s?\.=\s?"(.*?)";/g

const extract_sql = (sqlString) => {
    const matches = [...sqlString.matchAll(sqlRegex)]
    const queries = matches.map(match => match[1].replace(/\s+/g, ' ').trim())
    const templateString = queries.join('\n')

    return templateString
}

console.log(extract_sql(`
$sql .= "SELECT";
$sql .= " ca.codigo";
        $sql .= " FROM";
        $sql .= " cotizacion_aceptada AS ca INNER JOIN proyectojefe AS pj ON";
        $sql .= " ca.codigo = pj.proyecto";
        $sql .= " AND";
        $sql .= " ca.preparado = true";
        $sql .= " AND";
        $sql .= " pj.trabajador = $usuario";
        $sql .= " AND ";
        $sql .= " pj.bloqueado = false";
        $sql .= " INNER JOIN";
        $sql .= " proyecto AS p ON";
        $sql .= " ca.codigo = p.codigo";
        $sql .= " AND";
        $sql .= " p.proyecto_ok = true";

        $sql .= " UNION";
        $sql .= " SELECT ";
        $sql .= " ca.codigo";
        $sql .= " FROM ";
        $sql .= " cotizacion_aceptada AS ca INNER JOIN jefe_proyecto_interino AS jpi ON";
        $sql .= " ca.codigo = jpi.proyecto";
        $sql .= " AND";
        $sql .= " ca.preparado = true";
        $sql .= " AND";
        $sql .= " jpi.trabajador = $usuario";
        $sql .= " AND ";
        $sql .= " jpi.bloqueado = false";
        $sql .= " INNER JOIN ";
        $sql .= " proyecto AS p ON";
        $sql .= " ca.codigo = p.codigo";
        $sql .= " ORDER BY 1 ASC";
`))