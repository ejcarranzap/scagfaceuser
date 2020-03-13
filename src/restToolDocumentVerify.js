module.exports.restToolDocumentVerify = {
    fs: require('fs'),
    m: {
        method: 'POST',
        path: '/server/main/restToolDocumentVerify',
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
                    requestFirmaXml = requestFirmaXml + '<VerificaDocumentoRequest id="' + guid + '"/>';

                    var args = {
                        data: requestFirmaXml,
                        headers: {
                            "Content-Type": "application/xml",
                            "Authorization": "Bearer " + token
                        }
                    };

                    clientFirma.post("https://dev.api.ifacere-fel.com/fel-dte-services/api/verificarDocumento", args, function (data, response) {
                        var json = JSON.parse(JSON.stringify(data));
                        console.log(json);
                        if(json.VerificaDocumentoResponse.listado_documentos){
                            reply('<xmlerror><code>'+
                                    '0'+
                                    '</code><msg>'+
                                    'El documento ya esta certificado.'+
                                    '</msg></xmlerror>');
                        }else{
                            reply('<xmlerror><code>'+
                                    '-1'+
                                    '</code><msg>'+
                                    'El documento no ha sido certificado.'+
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
                    reply('<xml>' + e.message + '</xml>')
                }
            }
        }
    }
};