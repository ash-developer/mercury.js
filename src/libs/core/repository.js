'use strict';

var mercury = require('../mercury'),
    _ = require('lodash-node'),
    Promise = require('bluebird');

function Repository() {
}

Repository.prototype.list = function (conditions, callback) {
    var query = mercury.db.queryBuilder(this.table).select();

    callback = callback || function () {};

    if (conditions) {
        if (conditions.where) {
            _.each(conditions.where, function (values, key) {
                if (_.isArray(values)) {
                    values.forEach(function (value) {
                        query.where(key, value);
                    });
                } else {
                    query.where(key, values);
                }
            });
        }
        if (conditions.whereNot) {
            _.each(conditions.whereNot, function (values, key) {
                if (_.isArray(values)) {
                    values.forEach(function (value) {
                        query.whereNot(key, value);
                    });
                } else {
                    query.whereNot(key, values);
                }
            });
        }
    }

    var resolver = Promise.pending();

    query.then(function (response) {
        resolver.resolve(response);
        callback(null, response);
    }).catch(function (error) {
        resolver.reject(error);
        callback(error);
    });

    return resolver.promise;
};

Repository.prototype.get = function (identifier, callback) {
    mercury.db.queryBuilder(this.table).select().where(identifier).limit(1).then(function (response) {
        if (response.length === 0) {
            return callback({ message: 'No items for provided identifier' });
        }

        callback(null, response[0]);
    }).catch(callback);
};

Repository.prototype.create = function (attributes, callback) {
    mercury.db.queryBuilder(this.table).insert(attributes).then(function (response) {
        callback(null, response);
    }).catch(callback);
};

Repository.prototype.update = function (identifier, attributes, callback) {
    mercury.db.queryBuilder(this.table).update(attributes).where(identifier).then(function (response) {
        callback(null, response);
    }).catch(callback);
};

Repository.prototype.remove = function (identifier, callback) {
    mercury.db.queryBuilder(this.table).del().where(identifier).then(function (response) {
        callback(null, response);
    }).catch(callback);
};

module.exports = Repository;
