var exoStorage;

var StorageService = function (local_storage){
  this._localStorage = local_storage;
};

  StorageService.prototype.get = function(key, _default) {
      var serializedValue;
      serializedValue = this._localStorage.getItem(key);
      if (serializedValue === null || serializedValue === undefined) {
        return _default || null;
      }
      return JSON.parse(serializedValue);
  };

  StorageService.prototype.set = function(key, val) {
    if (_.isObject(key)) {
      return _.each(key, (function(_this) {
        return function(val, key) {
          return _this.set(key, val);
        };
      })(this));
    } else {
      return this._localStorage.setItem(key, JSON.stringify(val));
    }
  };

  StorageService.prototype.contains = function(key) {
    var value;
    value = this.get(key);
    return value !== null && value !== undefined;
  };

  StorageService.prototype.remove = function(key) {
    return this._localStorage.removeItem(key);
  };

  StorageService.prototype.clear = function() {
    return this._localStorage.clear();
  };
