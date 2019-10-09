module.exports.ruta = {
    bower: {
        method: 'GET',
        path: '/bower_components/{file*}',
        handler: {
            directory: {
                path: '../bower_components/',
                listing: true
            }
        }
    },
    fonts: {
        method: 'GET',
        path: '/fonts/{file*}',
        handler: {
            directory: {
                path: './site/fonts',
                listing: true
            }
        }
    },
    app: {
        method: 'GET',
        path: '/app/{file*}',
        handler: {
            directory: {
                path: './site/appenc',
                listing: true
            }
        }
    },
    css: {
        method: 'GET',
        path: '/css/{file*}',
        handler: {
            directory: {
                path: './site/css',
                listing: true
            }
        }
    },
    images: {
        method: 'GET',
        path: '/images/{file*}',
        handler: {
            directory: {
                path: './site/images',
                listing: true
            }
        }
    },
    js: {
        method: 'GET',
        path: '/js/{file*}',
        handler: {
            directory: {
                path: './site/js',
                listing: true
            }
        }
    }
};

