var exo_settings;

var ExOSettings = function(){
    this._values = {};
    this.init();
};

ExOSettings.prototype.init = function(){
   this._values['inbox-url'] = $('body').data('inbox');
};

ExOSettings.prototype.get = function(key){
    return this._values[key];
};
