module.exports.restTool = {
    m: {
        method: 'GET',
        path: '/server/main/restTool',
        config: {
            auth: false,
            handler: function (request, reply) {
                try {
                    var Client = require('node-rest-client').Client;

                    var client = new Client();

                    var xml = '<SolicitaTokenRequest><usuario>4482441</usuario><apikey>EsQCKW0KE89b3xeoytde9Bp</apikey></SolicitaTokenRequest>';

                    /*set content-type header and data as json in args parameter*/
                    var args = {
                        data: xml,
                        headers: { "Content-Type": "application/xml" }
                    };

                    

                    client.post("https://dev.api.ifacere-fel.com/fel-dte-services/api/solicitarToken", args, function (data, response) {
                        /*parsed response body as js object*/
                        console.log(data);
                        /*raw response*/
                        console.log(response);

                        reply({
                            success: true,
                            msg: 'Operación exitosa.',
                            data: data,
                            total: 0
                        });
                    });



                } catch (e) {
                    reply({
                        success: false,
                        msg: e.message,
                        data: {},
                        total: 0
                    });
                }
            }
        }
    }
};