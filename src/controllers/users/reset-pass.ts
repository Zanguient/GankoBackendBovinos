import { service, Email } from '../../services/user-service';
import { Response, Request } from 'express';
import { Observable } from 'rxjs/Observable';
const nodemailer = require('nodemailer');

interface RequestBody {
    email: string;
}

class ResponseBody {
    constructor(public success: boolean,
        public data: Email,
        public err: string) { }
}
//se ejecuta cuando se requiere recuperacion de contraseña
export function resetPassword(req: Request, res: Response, next) {
    let reset = req.body as RequestBody;
    service.resetPassword(reset.email)
        .subscribe(data => {
            if(data.length > 0){
                sendMail(data[0]);
                res.send(new ResponseBody(data ? true : false, data[0], null));
            }else{
                res.send(new ResponseBody(null, null, "Error, email Incorrecto"));
            }
            
        }, err => {
            res.status(500).send(new ResponseBody(false, null, err));
        });
}
//envia el correo con la nueva contraseña y la inserta en la base de datos
function sendMail(data: Email) {

    let mailOptions;
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: "cristian9016fxchoice@gmail.com",
            pass: "3177313834"
        }
    });
    let state: string = data.estado;
    let mail: string = data.email;
    if (state == "activo") {
        let newPass: string = Math.random().toString(36).slice(2);
        let bodyText: string = "This is your new password, use it to login into Ganko, then change it for a new one: " + newPass;
        mailOptions = {
            from: '"Ganko" <service@ganko.com>',
            to: mail + "," + mail,
            subject: 'Contraseña Cambiada ✔',
            text: 'Contraseña Cambiada',
            html: bodyText
        };
        //se cambia el password por el nuevo
        service.changePassword(newPass, mail)
            .subscribe();
    } else {
        let bodyText: string = "Error, su cuenta no se encuentra activa, si cree que esto es un error, por favor contactese con servicio al cliente";
        mailOptions = {
            from: '"Ganko"',
            to: "cristian9016@gmail.com,cristian9016@gmail.com",
            subject: 'Error Cuenta Desactivada',
            text: 'Error Cuenta Desactivada',
            html: bodyText
        };
    }
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
    });
    return
}