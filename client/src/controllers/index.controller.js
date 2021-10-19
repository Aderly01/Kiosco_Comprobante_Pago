const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const pdf = require('html-pdf');
const fs = require('fs');
const print = require('pdf-to-printer');

const optionsP = {
    printer: "ZDesigner ZD230-203dpi ZPL",
    unix: ["-o fit-to-page"],
    win32: ['-print-settings "fit"']
};

const options = {height: "150mm",width: "270mm"};
//const options = {format: "Letter",orientation:"landscape"};

const showHome = (req,res)=>{
    res.render('home');
}
const showHomePost = (req,res)=>{
    res.render('home');
}
const getEmployee = async(req,res)=>{
    const codigo = req.body.codEmpleado;
    try {
        const response = await fetch(`http://localhost:4000/employee/${codigo}`);
        const data = await response.json();
        if(data == false){
            res.render('home',{
                codigo:codigo,
                alert: true,
                alertTitle: "Error",
                alertMessage: `NO EXISTE EMPLEADO CON CODIGO ${codigo}`,
                alertIcon:'error',
                showConfirmButton: false,
                timer: 2000
            });
        }else{
            if(data[0].pin == null){
                res.render('setPin',{codigo:codigo})
            }else{
                res.render('header',{data:data[0],codigo:codigo})
            }
        }
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
}
const showSetPin = async(req,res)=>{
    const codigo = req.body.codigoEm;
    const pin = req.body.pin
    try {
        const response = await fetch(`http://localhost:4000/employee/${codigo}`);
        const data = await response.json();
        if(data[0].pin != pin){
            res.render('header',{
                data:data[0],
                codigo:codigo,
                alert: true,
                alertTitle: "Error",
                alertMessage: `PIN INCORRECTO`,
                alertIcon:'error',
                showConfirmButton: false,
                timer: 2000
            })
        }else{
            res.render('setPin',{codigo:codigo})
        }
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
}
const updatePIN = async(req,res)=>{
    const codigo = req.body.codigoEm;
    const pin1 = req.body.new_pin;
    const pin2 = req.body.new_pin2;
    try {
        if(pin1 == "" || pin2 == ""){
            res.render('setPin',{
                codigo:codigo,
                alert: true,
                alertTitle: "Error",
                alertMessage: `POR FAVOR RELLENE LOS CAMPOS`,
                alertIcon:'error',
                showConfirmButton: false,
                timer: 2000
            })
        }else{
            if(isNaN(pin1) || isNaN(pin2)){
                res.render('setPin',{
                    codigo:codigo,
                    alert: true,
                    alertTitle: "Error",
                    alertMessage: `EL PIN DEBE SER UN NUMERO`,
                    alertIcon:'error',
                    showConfirmButton: false,
                    timer: 2000
                })
            }else{
                if(pin1 !== pin2){
                    res.render('setPin',{
                        codigo:codigo,alert: true,
                        alertTitle: "Error",
                        alertMessage: `LOS PINs NO SON IGUALES`,
                        alertIcon:'error',
                        showConfirmButton: false,
                        timer: 2000
                    })
                }else{
                    const response = await fetch(`http://localhost:4000/update-employee/${codigo}/${pin2}`);
                    const data = await response.json();
                    const response2 = await fetch(`http://localhost:4000/employee/${codigo}`);
                    const data2 = await response2.json();
                    res.render('header',{
                        codigo:codigo,
                        data2:data[0],
                        data:data2[0],
                        alert: true,
                        alertTitle: "Cambio de PIN Exitoso",
                        alertMessage: "USE SU NUEVO PIN!",
                        alertIcon:'success',
                        showConfirmButton: false,
                        timer: 3000
                        })
                }
            }
        }
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }

}
const pdFormat = async(req,res)=>{
    const codigo = req.body.codigoEm;
    const pin = req.body.pin;
    try {
        const response = await fetch(`http://localhost:4000/employee/${codigo}`);
        const data = await response.json();
        const response2 = await fetch(`http://localhost:4000/get-inde/${codigo}/${data[0].fecha_inicio}`);
        const data2 = await response2.json();
        const response3 = await fetch(`http://localhost:4000/get-totalDed/${codigo}/${data[0].fecha_inicio}`);
        const totalDed = await response3.json();

        if(data[0].pin !== pin){
            res.render('header',{
                data:data[0],
                codigo:codigo,
                alert: true,
                alertTitle: "Error",
                alertMessage: `PIN INCORRECTO`,
                alertIcon:'error',
                showConfirmButton: false,
                timer: 2000
            })
        }else{
            const inicio = JSON.stringify(data[0].fecha_inicio).substring(1,11)
            const final = JSON.stringify(data[0].fecha_final).substring(1,11)

            res.render('pdf',{
                data:data[0],
                inicio,final,
                codigo:codigo,
                cats:data2,
                totalDeducciones:totalDed[0].total
                },function(err,html){
                pdf.create(html,options).toFile(`./pdf/nominaPDF.pdf`,function(error,results){
                    if(error){
                        console.log(error);
                    }else{
                        console.log(results)
                        /* var datafile = fs.readFileSync(`./pdf/nominaPDF.pdf`);
                        res.header('content-type','application/pdf');
                        res.send(datafile); */
                        /* .getPrinters() */
                        
                        res.render('header', {
                            alert1: true,
                            alertTitle: "Imprimiendo...",
                            alertMessage: "¡Tome su Comprobante de Pago!",
                            alertIcon:'success',
                            showConfirmButton: false,
                            timer: 3000,
                            ruta: ''
                        });
                        print
                            .print('./pdf/nominaPDF.pdf',optionsP)
                            .then(console.log); 
                    }
                })
            })
            const response4 = await fetch(`http:/localhost:4000/insert-print/${codigo}/${data[0].nombre_empleado}`)
            const insersion = await response4.json();
        }
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
}
const volver = async(req,res)=>{
    const codigo = req.body.codigoEm;
    try {
        const response = await fetch(`http://localhost:4000/employee/${codigo}`);
        const data = await response.json();
        res.render('header',{data:data[0],codigo:codigo})
    } catch (error) {
        console.log(error);
        res.redirect('/')
    }
}
module.exports = {
    showHome,
    getEmployee,
    showSetPin,
    pdFormat,
    updatePIN,
    volver,
    showHomePost
}