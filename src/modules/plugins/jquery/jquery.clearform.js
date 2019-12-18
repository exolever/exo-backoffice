$.fn.clearForm = function() {
  return this.each(function() {
    var type = this.type, tag = this.tagName.toLowerCase();
    var $this = $(this);
    if (tag == 'form')
      return $(':input',this).clearForm();
    if (type == 'text' || type == 'password' || tag == 'textarea' || type == 'search' || type == 'number')
      $this.val('');
    else if (type == 'checkbox' || type == 'radio'){
      $this.iCheck('uncheck');
    }
    else if (tag == 'select' || type == 'select-one' || type == 'select-multiple'){
          if ( type == 'select-one'){
            $this.val("").trigger('change');
          }
          else{
              $this.val(null).trigger('change');
          }
    }

  });
};
