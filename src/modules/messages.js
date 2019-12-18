var ToastrManager = function(){
  this.url = urlservice.resolve('messages');
  this.init_options();
};

ToastrManager.prototype.init_options = function(){
  toastr.options = {
      "closeButton": true,
      "debug": false,
      "progressBar": true,
      "preventDuplicates": false,
      "positionClass": "toast-bottom-right",
      "onclick": null,
      "showDuration": "400",
      "hideDuration": "1000",
      "timeOut": "7000",
      "extendedTimeOut": "5000",
      "showEasing": "swing",
      "hideEasing": "linear",
      "showMethod": "fadeIn",
      "hideMethod": "fadeOut"
    };
};

ToastrManager.prototype.load_messages = function(){
  var _self = this;
  $.get(this.url, function(data){
      _.each(data, function(value){
          var shortCutFunction = value.tags;
          var title = "";
          var msg = value.message;
          _self.show_message(shortCutFunction, msg, title);
      });
  });
};

ToastrManager.prototype.show_message = function(type, msg, title){
  var $toast = toastr[type](msg, title);
};

var toastr_manager;
