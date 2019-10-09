module.exports.home = {
    html: function(req, reply, read){
        try{
            return reply(read('./site/index.html','utf8'));
        }catch(e){
            return reply(e.message);
        }
    }
};