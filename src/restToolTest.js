module.exports.restToolTest = {
    m: {
        method: 'POST',
        path: '/server/main/restToolTest',
        config: {
            auth: false,
            handler: function (request, reply) {
                try {
                    var reg = JSON.parse(request.payload);
                    console.log(reg);
                    var buf = Buffer.from(reg.xml, 'base64');                
                    var crypto = require('crypto');

                    var iv = Buffer.from(reg.iv, 'base64'),
                        key = Buffer.from(reg.key, 'base64');
                
                    var decipher = crypto.createDecipheriv("aes256", key, iv);

                    var xml = "";                
                    xml = decipher.update(buf, "hex", "utf8");
                    xml = xml + decipher.final().toString('utf8');

                    
                    console.log('xml', xml, 'UUID', reg.UUID);

                    reply(xml);

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