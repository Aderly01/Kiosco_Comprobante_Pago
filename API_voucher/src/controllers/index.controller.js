const { pool } = require('./coneccionPG');

const getEmployee = async (req,res)=>{
    const cod = req.params.codigo; 
    await pool.query(`SELECT * FROM fnt_getpayslip('${cod}')`,
    (error, results)=>{
        if(error){
            res.json({error:error.message});
        }
        else{
            res.json(results.rows);
        }
    });
}
const updatePinEmploye = async (req,res)=>{
    const codigo = req.params.codigo; 
    const newPin = req.params.newPin;
    await pool.query(`SELECT fnt_updatePinEmploye('${codigo}','${newPin}')`,
    (error, results)=>{
        if(error){
            res.json({error:error.message});
        }
        else{
            res.json({sesults:'PIN ACTUALIZADO'});
        }
    });
}

const getInDePayslip = async (req,res)=>{
    const codigo = req.params.codigo; 
    const fecha = req.params.fecha;
    await pool.query(`SELECT * FROM fnt_getInDePayslip('${codigo}','${fecha}')`,
    (error, results)=>{
        if(error){
            res.json({error:error.message});
        }
        else{
            res.json(results.rows);
        }
    });
}
const getTotalDed = async (req,res)=>{
    const codigo = req.params.codigo; 
    const fecha = req.params.fecha;
    await pool.query(`SELECT SUM(monto) AS total FROM fnt_getInDePayslip('${codigo}','${fecha}') WHERE categoria = 'is_deduction'`,
    (error, results)=>{
        if(error){
            res.json({error:error.message});
        }
        else{
            res.json(results.rows);
        }
    });
}

const insertRecPaPrint = async (req,res)=>{
    const codigo = req.params.codigo;
    const nombre = req.params.nombre;
    await pool.query(` select fnt_record_payslip_print('${codigo}','${nombre}')`,
    (error,results)=>{
        if(error){
            res.json({error:error.message});
        }else{
            res.json({resultado:"ok"});
        }
    });
}


module.exports = {
    getEmployee,
    updatePinEmploye,
    getInDePayslip,
    getTotalDed,
    insertRecPaPrint
}