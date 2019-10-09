'use strict';

const _ = require('underscore');
const Bcrypt = require('bcrypt');
const Hapi = require('hapi');
const async = require('async');
const Cookie = require('hapi-auth-cookie');
const vm = require('vm');
const Inert = require('inert');
const encoding = require('encoding');

var requireFromString = require('require-from-string');
var corsHeaders = require('hapi-cors-headers');
var passwordHash = require('password-hash');
var path = require('path');
var sql = require('mssql');
var __dirname = '.\\dll\\';
var edge = require('edge');

var decryFunction = edge.func({
  assemblyFile: (__dirname + 'SourceCodeEncryption.dll'),
  typeName: 'Encryption',
  methodName: 'Decrypt',
  sync: true
});

var EntradaTransaccion = edge.func({
  assemblyFile: (__dirname + 'PagoTercerosLib.dll'),
  typeName: 'PagoTerceros',
  methodName: 'EntradaTransaccion',
  sync: true
});

var GenerarLlave = edge.func({
  assemblyFile: (__dirname + 'PagoTercerosLib.dll'),
  typeName: 'PagoTerceros',
  methodName: 'GenerarLlave',
  sync: true
});



var fs = require('fs'),
  str2js = require('string-to-js'),
  read = fs.readFileSync;

var auth, middleware, sandbox = {
  console: console,
  setTimeout: setTimeout,
  clearTimeout: clearTimeout,
  require: require,
  module: module,
  exports: exports,
  process: process,
  Buffer: Buffer
};

var salt = Bcrypt.genSaltSync(10);
const server = new Hapi.Server();

server.connection({
  port: 3061,
  router: {
    stripTrailingSlash: true
  },
  routes: {
    cors: true
  }
});

/*encrypted modules set context*/
require.extensions[".jse"] = function(m) {
  decryFunction({
    message: read(m.filename, 'utf8'),
    password: 'epsilon8'
  }, function(err, res) {
    /*console.log(m.filename);*/
    //if(res.indexOf("Licencia") != -1)
    /*console.log(res);
    console.log(path.dirname(m.filename) + "\\" + path.parse(m.filename).name + '.js');*/
    var dir = './mymodulesx/' + path.parse(m.filename).name + '.js';
    vm.runInNewContext(res, sandbox, dir);
    switch (path.parse(m.filename).name) {
      case 'ruta':
        /*console.log('Registrando rutas...');*/
        server.route(sandbox.module.exports.ruta.bower);
        server.route(sandbox.module.exports.ruta.fonts);
        server.route(sandbox.module.exports.ruta.app);
        server.route(sandbox.module.exports.ruta.css);
        server.route(sandbox.module.exports.ruta.images);
        server.route(sandbox.module.exports.ruta.js);
        break;
      case 'login':
        server.route(sandbox.module.exports.login.appLogin);
        break;
      case 'Bo_scagface_configuracion_rubro_cuenta_ajena':
        server.route(sandbox.module.exports.Bo_scagface_configuracion_rubro_cuenta_ajena.m);
        break;
      case 'Bo_scagface_factura_enca':
        server.route(sandbox.module.exports.Bo_scagface_factura_enca.m);
        break;
      case 'Bo_scagface_factura_deta':
        server.route(sandbox.module.exports.Bo_scagface_factura_deta.m);
        break;
      case 'itxweb_tool':
        server.route(sandbox.module.exports.itxweb_tool.m);
        break;
      case 'report_tool':
        server.route(sandbox.module.exports.report_tool.m);
        break;
      case 'mytool':
        server.route(sandbox.module.exports.mytool.m);
        break;
      case 'test':
        server.route(sandbox.module.exports.test.m);
        break;
      case 'Bo_scagface_factura_tool':
        server.route(sandbox.module.exports.Bo_scagface_factura_tool.m);
        break;
    }
  });
};

/*Load encrypted modules*/
require("./mymodulesenc/ruta.jse");
require("./mymodulesenc/home.jse");
require("./mymodulesenc/services.jse");
require("./mymodulesenc/auth.jse");
require("./mymodulesenc/middleware.jse");
require("./mymodulesenc/mysqlcn.jse");
require("./mymodulesenc/mssqlcn.jse");
require("./mymodulesenc/mssqlcnsync.jse");
require("./mymodulesenc/Bo_scagface_configuracion_rubro_cuenta_ajena.jse");
require("./mymodulesenc/Bo_scagface_factura_enca.jse");
require("./mymodulesenc/Bo_scagface_factura_deta.jse");
require("./mymodulesenc/Bo_scagface_factura_tool.jse");

require("./mymodulesenc/login.jse");
require("./mymodulesenc/itxweb_tool.jse");
require("./mymodulesenc/report_tool.jse");
require("./mymodulesenc/mytool.jse");
require("./mymodulesenc/test.jse");




server.ext('onPreResponse', function(request, reply) {
  //corsHeaders(request, reply);
  if (request.response.isBoom) {
    const err = request.response;
    const errName = err.output.payload.error;
    const statusCode = err.output.payload.statusCode;

    return reply({
        code: statusCode,
        msg: errName
      })
      .code(statusCode);
  }

  reply.continue();
});


server.register(Inert, (err) => {
  if (err)
    console.log("Error: " + err);
});

server.register(Cookie, (err) => {
  server.route({
    method: 'GET',
    path: '/home',
    config: {
      auth: false,
      handler: function(req, reply) {
        sandbox.module.exports.home.html(req, reply, read);
      }
    }
  });

  server.route({
    method: 'GET',
    path: '/pagoterceroentrada',
    config: {
      auth: false,
      handler: function(req, reply) {
        try {
          EntradaTransaccion({
            message: '<REQPAGOREVERSIONGENERICO>' +
              '<ID>127</ID>' +
              '<LLAVE>1208400635230</LLAVE>' +
              '<TVALIDACION>1</TVALIDACION>' +
              '<MONTO_PAGADO>150.00</MONTO_PAGADO>' +
              '<BANCO>GT</BANCO>' +
              '<FECHA_PAGO>20/01/2014</FECHA_PAGO>' +
              '<PAGO_REVERSION>P</PAGO_REVERSION>' +
              '<HORA_PAGO>13:00:14</HORA_PAGO>' +
              '<AGENCIA>00000120</AGENCIA>' +
              '<AUT_BCO>000000000635230</AUT_BCO>' +
              '<USUARIO>120101 </USUARIO>' +
              '<TERMINAL>7D02CCC8  </TERMINAL>' +
              '</REQPAGOREVERSIONGENERICO>'
          }, function(err, res) {
            if(err){
              reply(err);
            }else{
              try{
                var parser = require('xml2json');
                var myjson = parser.toJson(res,{
                    object: true,
                    reversible: false,
                    coerce: false,
                    sanitize: true,
                    trim: true,
                    arrayNotation: false,
                    alternateTextNode: false
                });
                reply(myjson.NewDataSet.Data);
              }catch(e){
                reply(e);
              }
            }
          });
        } catch (e) {
          reply(e);
        }
      }
    }
  });

  server.route({
    method: 'GET',
    path: '/pagotercerogenerallave',
    config: {
      auth: false,
      handler: function(req, reply) {
        try {
          GenerarLlave({
              VALIDACION_DE_PAGO: 1,
              ID: 1001,
              FECHA: '24/06/2017',
              MONTO: 1002.87
          }, function(err, res) {
            var parser = require('xml2json');
            //var myjson = parser.toJson(res);
            console.log(err);
            if(err){
              reply(err);
            }else{
              reply(res);
            }
          });
        } catch (e) {
          reply(e);
        }
      }
    }
  });

  server.route({
    method: 'POST',
    path: '/upload',
    config: {

      payload: {
        output: 'stream',
        parse: true,
        allow: 'multipart/form-data'
      },

      handler: function(request, reply) {
        try {
          var data = request.payload;
          if (data.file) {
            /*console.log(data.file);*/

            var name = data.file.hapi.filename;
            var path = ".\\uploads\\" + name;
            var file = fs.createWriteStream(path);

            file.on('error', function(err) {
              console.error(err);
            });

            data.file.pipe(file);

            data.file.on('end', function(err) {
              var ret = {
                data: {
                  filename: data.file.hapi.filename,
                  headers: data.file.hapi.headers
                }
              }
              reply(ret);
            })
          }

        } catch (e) {
          reply({
            code: -1,
            msg: "Error: " + e.message,
            success: false,
            message: "Error: " + e.message
          });
        }
      }
    }
  });



  server.start((err) => {

    if (err) {
      console.log('Error: ' + err.message);
    }

    console.log('ITXWEB server running at: ' + server.info.uri);
  });
});
