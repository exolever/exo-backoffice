var icheck_options;

var iChecksManager = function(){
    this.className = 'ichecksoptions';
};

iChecksManager.prototype.get_defaults = function(){
    return {
        checkboxClass: 'icheckbox_square-orange',
        radioClass: 'iradio_square-orange',
    };
};
