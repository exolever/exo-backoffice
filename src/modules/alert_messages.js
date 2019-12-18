var AlertManager = function(){
  this.url = urlservice.resolve('messages');
  this.init_options();
};

AlertManager.prototype.init_options = function(){
  swal.setDefaults({
    showCancelButton: true,
    animation: false,
    closeOnConfirm: true
  });
  this.defaults = {
    confirmButtonText: "Yes, remove",
    title: '',
    text: '',
    type: 'warning'
  };
};

AlertManager.prototype.show_message = function(options, callback){
  var swal_options = _.defaults(options, this.defaults);
  swal(swal_options, callback);
};

var alert_manager;
