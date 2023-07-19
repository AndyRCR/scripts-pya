const formatSQLString = query => {
    const formattedQuery = query
        .replace(/\s+/g, ' ') // Reemplazar múltiples espacios en blanco por uno solo
        .replace(/(\bSELECT\b|\bFROM\b|\bWHERE\b|\bJOIN\b|\bINNER JOIN\b|\bON\b|\bAND\b|\bOR\b|\bORDER BY\b|\bGROUP BY\b|\bWITH\b|\bAS\b|\bDISTINCT\b|\bSUM\b|\bCOALESCE\b|\bEXTRACT\b)\s*/g, '\n$&') // Insertar salto de línea antes de palabras clave
        .replace(/(,|\()(\s+)/g, '$1 ') // Eliminar espacios después de coma o paréntesis
        .replace(/(\s+)(,|\))/g, '$2') // Eliminar espacios antes de coma o paréntesis
        .trim()

    return formattedQuery
}

console.log(formatSQLString(`
/** QUERY DE GOOOOOOD */ 

--SELECT SUM(ctd_porcentaje / 100) AS cantidad 

 

--SELECT SUM((ctd.ctd_porcentaje)*cat_factor) as uno 

 

SELECT  t.apellidopaterno || ' '  || t.apellidomaterno || ', ' || t.nombre as nombre, t.dependencia, ctd.dep_codigo, t.codigo 

FROM carga_trabajador_disponible ctd 

INNER JOIN trabajador t on t.codigo = ctd.tra_codigo  

WHERE extract(month from ctd.cat_mes) = 04 

  AND extract(year from ctd.cat_mes) = 2022 

  AND ctd.cat_codigo = 251 

  AND ctd.dep_codigo = 13 

  AND t.especialidad IN(3) 

  ORDER BY 1 

  --AND dep_codigo NOT IN(8) 

 

 

------------------------ 

SELECT (( (  

SELECT COALESCE(SUM((ctd_porcentaje/100) * cat_factor),0)  

--SELECT  t.apellidopaterno || ' '  || t.apellidomaterno || ', ' || t.nombre as nombre, t.dependencia, ctd.dep_codigo,t.especialidad , t.codigo , t.trabajadorestado 

   FROM carga_trabajador_disponible ctd  

   INNER JOIN trabajador t ON t.codigo = ctd.tra_codigo  

   WHERE EXTRACT(MONTH FROM cat_mes) = 1 AND  

   EXTRACT(YEAR FROM cat_mes) = 2023 AND cat_codigo = 267  

   AND dep_codigo = 29  

AND t.trabajadorestado = 1 

   AND t.especialidad IN (1, 3, 4, 13, 22, 23) ORDER BY 1 ASC 

) 

) * 190) * 0.9 AS eficiencia 

 

----- V3  ----- disponibilidad hh 175 

with TABLA as( 

SELECT  

--DISTINCT dep_codigo 

cat_mes,t.codigo, 

t.nombre,t.apellidopaterno,t.apellidomaterno, dep_codigo ,ctd_porcentaje, cat_factor,((ctd_porcentaje) * cat_factor) AS cantidad 

--SUM((ctd_porcentaje/100) * cat_factor) AS cantidad 

FROM carga_trabajador_disponible ctd 

INNER JOIN trabajador t on t.codigo = ctd.tra_codigo 

WHERE 

extract(month from cat_mes) = 02 AND 

extract(year from cat_mes) = 2023 AND 

cat_codigo = 268  

and 

dep_codigo = 20 

--tra_codigo = 3733 

--AND dep_codigo NOT IN(8) 

ORDER BY t.apellidopaterno ASC) 

--SELECT 

SELECT ((SUM(cantidad)/100)* 175) * 0.9 AS eficiencia FROM tabla 
`))