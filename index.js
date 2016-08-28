/* jshint strict: true */

'use strict';

var Q = require('q');
var mysql2 = require('mysql2');
var instances = {};

function DB() {
  this.pool = null;
}

/**
 * Setup the Database connection pool for this instance
 * @param  {Object} config
 */
DB.prototype.configure = function (config) {
  this.pool = mysql2.createPool(config);
};

/**
 * Run DB query
 * @param  {String} query
 * @param  {Object} [params]
 * @return {Promise}
 */
DB.prototype.query = function (query, params) {
  params = params || {};
  var db = this;

  return Q.Promise(function (resolve, reject) {
    db.pool.getConnection(function (err, con) {
      if (err) {
        if (con) {
          con.release();
        }

        return reject(err);
      }

      con.query(query, params, function (err) {
        if (err) {
          if (con) {
            con.release();
          }

          return reject(err);
        }

        resolve([].splice.call(arguments, 1));
        con.release();
      });
    });
  });
};

/**
 * Run DB execute
 * @param  {String} query
 * @param  {Object} [params]
 * @return {Promise}
 */
DB.prototype.execute = function (query, params) {
  params = params || {};
  var db = this;

  return Q.Promise(function (resolve, reject) {
    db.pool.getConnection(function (err, con) {
      if (err) {
        if (con) {
          con.release();
        }

        return reject(err);
      }

      con.execute(query, params, function (err) {
        if (err) {
          if (con) {
            con.unprepare(query);
            con.release();
          }

          return reject(err);
        }

        resolve([].splice.call(arguments, 1));
        con.unprepare(query);
        con.release();
      });
    });
  });
};

module.exports = function (name) {
  name = name || '_default_';

  if (!instances[name]) {
    instances[name] = new DB();
  }

  return instances[name];
};
