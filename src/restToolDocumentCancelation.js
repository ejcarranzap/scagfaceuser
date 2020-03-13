module.exports.restToolDocumentCancelation = {
    fs: require('fs'),
    m: {
        method: 'POST',
        path: '/server/main/restToolDocumentCancelation',
        config: {
            auth: false,
            handler: function (request, reply) {
                try {

                    var reg = JSON.parse(request.payload);
                    console.log(reg);

                    var Client = require('node-rest-client').Client;

                    var clientFirma = new Client();
                    var token = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzY29wZSI6WyJvcGVuaWQiXSwiZXhwIjoxNTkxMjg5NzM3LCJhdXRob3JpdGllcyI6WyJST0xFX0VNSVNPUiJdLCJqdGkiOiI0NTQ0YmM3Mi1hNGY3LTQ1OWUtODdhMi00ZTUxZjg1NzU4MzYiLCJjbGllbnRfaWQiOiI0NDgyNDQxIn0.MX6sUzzzhr-U_L_Y52nuwk2rXJUp6RKbv7Q6cZScXL8Bkq8x65ywgp0ZaHzekMQjETS3Idc3z4rVw2JmOJUxwJHEnjFALU_IvYO2F54RBP1DsIhvT0y-taRuzKzFtWIVuuKOmZ_3Keyo6y-lXghAG9s7i0fO_zFJSCLENdvzZqflxDmStfO32hz1mVL3IQRxn-P7X-imJ_wtI2BtLqGM5fWKZX45vquRENsPMrIKxBslICEDhcJIGa-Chi77K_5G1ipWCqMm1L2p8HCiik5FZOSh1lsWfu7I7UwtgZF43m6wAAjap60WDE5WueqX2I_n8JcUrfpxMY8r3O7rR_UQLw';
                    var guid = reg.UUID;

                    var buf = new Buffer(reg.xml, 'base64');                
                    var crypto = require('crypto');

                    var iv = new Buffer(reg.iv, 'base64'),
                        key = new Buffer(reg.key, 'base64');
                
                    var decipher = crypto.createDecipheriv("aes256", key, iv);

                    var xml = "";                
                    xml = decipher.update(buf, "hex", "utf8");
                    xml = xml + decipher.final().toString('utf8');

                    var requestFirmaXml = '<?xml version="1.0" encoding="UTF-8"?>';
                    requestFirmaXml = requestFirmaXml + '<FirmaDocumentoRequest id="' + guid + '">';
                    requestFirmaXml = requestFirmaXml + '<xml_dte><![CDATA[' + xml + ']]></xml_dte>';
                    requestFirmaXml = requestFirmaXml + '</FirmaDocumentoRequest >';

                    var args = {
                        data: requestFirmaXml,
                        headers: {
                            "Content-Type": "application/xml",
                            "Authorization": "Bearer " + token
                        }
                    };

                    clientFirma.post("https://dev.api.soluciones-mega.com/api/solicitaFirma", args, function (data, response) {
                        var json = JSON.parse(JSON.stringify(data));
                        var error = json.FirmaDocumentoResponse.listado_errores.error;
                        console.log('json', json);
                        
                        if (error == undefined) {
                            console.log('Entro 2');
                            var client = new Client();
                            var requestXml = '<?xml version="1.0" encoding="UTF-8"?>';
                            requestXml = requestXml + '<AnulaDocumentoXMLRequest id="' + guid + '">';
                            requestXml = requestXml + '<xml_dte><![CDATA[' + json.FirmaDocumentoResponse.xml_dte + ']]></xml_dte>';
                            requestXml = requestXml + '</AnulaDocumentoXMLRequest >';

                            var args2 = {
                                data: requestXml,
                                headers: {
                                    "Content-Type": "application/xml",
                                    "Authorization": "Bearer " + token
                                }
                            };

                            client.post("https://dev.api.ifacere-fel.com/fel-dte-services/api/anularDocumentoXML", args2, function (data2, response2) {
                            /*client.post("https://dev2.api.ifacere-fel.com/api/anularDocumentoXML", args2, function (data2, response2) {*/
                                var json2 = JSON.parse(JSON.stringify(data2));
                                console.log('json2', json2);
                                if(!json2.AnulaDocumentoXMLResponse.listado_errores) json2.AnulaDocumentoXMLResponse.listado_errores = {}; 

                                var error2 = json2.AnulaDocumentoXMLResponse.listado_errores.error;
                                console.log('Error2 A: ', error2);                                

                                if (error2 == undefined) {
                                    
                                    /*reply({
                                        success: true,
                                        msg: 'Operación exitosa...',
                                        data: json2,
                                        total: 0
                                    });*/
                                    console.log('det entro...');
                                    reply(json2.AnulaDocumentoXMLResponse.xml_dte);
                                } else {
                                    
                                    console.log('error det entro...');
                                    /*reply({
                                        success: false,
                                        code: json2.RegistraDocumentoXMLResponse.listado_errores.error.cod_error,
                                        msg: json2.RegistraDocumentoXMLResponse.listado_errores.error.desc_error,
                                        data: json2,
                                        total: 0
                                    });*/
                                    if(Array.isArray(error2)){
                                        error2.cod_error = error2[0].cod_error;
                                        error2.desc_error = error2[0].desc_error;
                                    }
                                    console.log('Error2: ', error2);
                                    reply('<xmlerror><code>'+
                                    error2.cod_error+
                                    '</code><msg>'+
                                    error2.desc_error+
                                    '</msg></xmlerror>');
                                }

                            });

                        } else {
                            console.log('Entro Error');
                            /*reply({
                                success: false,
                                code: json.FirmaDocumentoResponse.listado_errores.error.cod_error,
                                msg: json.FirmaDocumentoResponse.listado_errores.error.desc_error,
                                data: json,
                                total: 0
                            });*/
                            console.log(json.FirmaDocumentoResponse.listado_errores.error);
                            if(Array.isArray(error)){
                                error.cod_error = error[0].cod_error;
                                error.desc_error = error[0].desc_error;
                            }

                            console.log(error);
                            reply('<xmlerror><code>'+
                            error.cod_error+
                            '</code><msg>'+
                            error.desc_error+
                            '</msg></xmlerror>');
                        }

                    });

                } catch (e) {
                    console.log(e);
                    /*reply({
                        success: false,
                        msg: e.message,
                        data: {},
                        total: 0
                    });*/
                    reply('<xml>'+e.message+'</xml>')
                }
            }
        }
    }
};