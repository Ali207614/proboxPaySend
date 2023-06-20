
const moment = require('moment')
let db = 'PROBOX_READY'


module.exports = {
    CURRENCY: `SELECT T0.\"RateDate\", T0.\"Currency\", T0.\"Rate\", T0.\"LogInstanc\", T0.\"UpdateDate\" FROM \"${db}\".\"ORTT\" T0`,
    START: `
    SELECT T4.\"U_FirstPayment\", T0.\"DocEntry\" , T0.\"DocNum\" , T0.\"DocDueDate\" as docDueDate , T3.\"Phone1\" , T1.\"InstId\", T2.\"InsTotal\", T2.\"DueDate\" as dueDate, T2.\"InstlmntID\", T2.\"PaidToDate\",  T3.\"CardCode\" , T3.\"CardName\" FROM \"${db}\".\"ORCT\"  T0  INNER JOIN   \"${db}\".\"RCT2\" T1 ON T0."DocEntry" = T1."DocNum" inner join \"${db}\".\"INV6\" T2 on T2."DocEntry" = T1."DocEntry" inner join \"${db}\".\"OCRD\" T3 on  T0."CardCode" = T3."CardCode" inner join  \"${db}\".\"OINV\" T4 ON T4."DocEntry" = T2."DocEntry" WHERE T0."DocEntry"  > ?
    `
}

