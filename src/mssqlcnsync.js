module.exports.mssqlcnsync = {
  mysql: require('mssql'),
  sync: require('synchronize'),
  myRequest: require('request-promise'),
  config: require('./config/config'),
  soap: require('soap'),
  middleware: module.exports.middleware,

  soaprequest: function(call, lastIdentity, fn) {
    console.log('soaprequest');
    try {
      if (lastIdentity) {
        call.params.body.extra.PID = lastIdentity;
      }

      var url = call.params.uri;
      var args = call.params.body.extra;
      console.log(url);
      console.log(args);

      module.exports.mssqlcnsync.soap.createClient(url, function(err, client) {
        console.log(call.params.webmethod);
        client[call.params.webmethod](args, function(err, result) {
          console.log('soap');
          var res = result[call.params.webmethod+'Result'];
          res = JSON.parse(res.toString().trim());
          console.log(res);
          console.log(res.msg);
          fn(null, res);
        });
      });
    } catch (e) {
      console.log('soaprequest error: ' + e.message);
    }
  },

  httprequest: function(call, lastIdentity, fn) {
    try {
      if (lastIdentity) {
        call.params.body.extra.Identity = lastIdentity;
      }

      module.exports.mssqlcnsync.myRequest(call.params).then(function(response) {
        console.log('http');
        console.log(response);
        var myReply = response;
        fn(null, myReply);
      });
    } catch (e) {
      console.log('httprequest error: ' + e.message);
    }
  },

  request: function(transaction, call, parent, fn) {
    var request = new module.exports.mssqlcnsync.mysql.Request(transaction);
    var mycall = call;
    for (var i = 0; i < mycall.params.length; i++) {
      var param = mycall.params[i];

      if (parent) {
        if (param.name == parent.name) {
          param.value = parent[parent.field];
        }
      }

      if (mycall.extra && mycall.Identity2) {
        if (param.name == mycall.IdentityParamName2) {
          param.value = mycall.extra[mycall.Identity2];
        }
        if (param.name == mycall.IdentityParamName) {
          param.value = mycall.extra[mycall.Identity];
        }
      }

      if ((module.exports.mssqlcnsync.mysql.DateTime == param.type) && (param.value != null) && (param.value != undefined)) {
        param.value = param.value.replace(/\//gi, '-');
        request.input(param.name, module.exports.mssqlcnsync.mysql.NVarChar(50), param.value);
      } else {
        request.input(param.name, param.type, param.value);
      }
    }

    request.execute(mycall.query).then(function(recordsets) {
      fn(null, recordsets);
    }).catch(function(err) {
      console.log(err);
      fn(null, err);
    });
  },
  transaction: function(isMiddleware, request, reply, calls, fn) {
    try {
      /*if (isMiddleware == 1) {
      	if (module.exports.middleware.ensureAuthenticated(request, reply) != "ok") {
      		fn({
      			success: false,
      			code: 999,
      			message: 'Error de autenticación.'
      		}, null);
      		return;
      	}
      }*/
      var cn = new module.exports.mssqlcnsync.mysql.Connection(module.exports.mssqlcn.config.MSSQL_CONFIG);
      cn.connect().then(function() { /*BEGIN CONNECTION*/
        var transaction = new module.exports.mssqlcnsync.mysql.Transaction(cn); /*BEGIN TRANSACTION*/
        transaction.begin().then(function(err) {

          module.exports.mssqlcnsync.request = module.exports.mssqlcnsync.sync(module.exports.mssqlcnsync.request);
          module.exports.mssqlcnsync.httprequest = module.exports.mssqlcnsync.sync(module.exports.mssqlcnsync.httprequest);
          module.exports.mssqlcnsync.soaprequest = module.exports.mssqlcnsync.sync(module.exports.mssqlcnsync.soaprequest);

          module.exports.mssqlcnsync.sync.fiber(function() {
            console.log('BEGIN TRANSACTION');
            var rolledBack = false;
            var existsErr = false;
            var myErr = {};
            var validateError = function(pmyresults) {
              var isOk = true;
              for (var k = 0; k < pmyresults.length; k++) {
                if (pmyresults[k].code != null && pmyresults[k].code != '0' && pmyresults[k].code != 480) {
                  isOk = false;
                }
              }
              return isOk;
            };

            transaction.on('rollback', function(aborted) {
              rolledBack = true;
            });

            var myresults = [];
            var lastIdentity = 0;
            var paramExtra = {};
            console.log(calls.length);
            for (var j = 0; j < calls.length; j++) {
              var mycall = calls[j];
              if (mycall.type == 'sql') {
                console.log(mycall);
                console.log('enca 1 ' + mycall.query);
                if (mycall.Identity2 != undefined) {
                  paramExtra = myresults[(myresults.length - 1)].data.slice(0)[0];
                  mycall.extra = paramExtra;
                  myresults.push(module.exports.mssqlcnsync.request(transaction, mycall, null));
                } else {
                  myresults.push(module.exports.mssqlcnsync.request(transaction, mycall, null));
                }
                if (myresults[(myresults.length - 1)].code == null) {
                  var parent = {};
                  if(mycall.Identity)
                  parent[mycall.Identity] = myresults[(myresults.length - 1)][0][0][mycall.Identity];
                  if (parent[mycall.Identity] != undefined) {
                    parent['name'] = mycall.IdentityParamName;
                    parent['field'] = mycall.Identity;
                    lastIdentity = parent[parent.field];

                    for (var jj = 0; jj < mycall.deta.length; jj++) {
                      var mycalld = mycall.deta[jj];
                      console.log('deta 1 ' + mycalld.query);
                      myresults.push(module.exports.mssqlcnsync.request(transaction, mycalld, parent));
                    }
                  }
                }
              } else if (mycall.type == 'http') {
                console.log(mycall.params);
                console.log('http 1 ' + mycall.params.uri);
                myresults.push(module.exports.mssqlcnsync.httprequest(mycall, lastIdentity));
                console.log('Request complete...');
              } else if (mycall.type == 'soap') {
                console.log(mycall.params);
                console.log('soap 1 ' + mycall.params.uri);
                myresults.push(module.exports.mssqlcnsync.soaprequest(mycall, lastIdentity));
                console.log('Request complete...');
              }
              if (validateError(myresults) == false) {
                console.log('validateError');
                j = calls.length;
              }
            }

            for (var k = 0; k < myresults.length; k++) {
              if (myresults[k].code != null && myresults[k].code != '0' && myresults[k].code != 480) {
                existsErr = true;
                myErr = myresults[k];
              }
            }

            if (existsErr == true) {
              transaction.rollback().then(function() {
                console.log('ROLLBACK');
                cn.close();
                fn(myErr, null);
              });
            } else {
              transaction.commit().then(function() {
                console.log("COMMIT");
                cn.close();
                fn(null, myresults);
              });
            }

          });
        }); /*END BEGIN TRANSACTION*/

      }); /*END CONNECTION*/
    } catch (e) {
      console.log(e.message);
      reply({
        success: false,
        msg: e.message,
        code: 'TRYERR'
      });
    }
  }
};
