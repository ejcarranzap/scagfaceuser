module.exports.getEncryptedText = {
    m: {
        method: 'POST',
        path: '/server/main/getEncryptedText',
        handler: function (request, reply) {
            try {
                var reg = request.payload;
                var buf = Buffer.from(reg.msg, 'base64');                
                var crypto = require('crypto');

                var iv = Buffer.from(reg.iv, 'base64'),
                    key = Buffer.from(reg.key, 'base64');
               
                var decipher = crypto.createDecipheriv("aes256", key, iv);

                var msg = "";                
                msg = decipher.update(buf, "hex", "ucs2");
                msg = msg + decipher.final().toString('ucs2');

                reply({
                    code: 0,
                    success: true,
                    msg: reg.msg.toString('ucs2'),
                    data: ''
                });
            } catch (e) {
                console.log(e.stack);
                reply({
                    code: -1,
                    success: false,
                    msg: e.stack,
                    data: []
                });
            }
        }
    }
};