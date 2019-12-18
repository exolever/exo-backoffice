// Tool to hide/show elements on forms

/*
    This class will provide a method to take control oover forms check options
    to hide/show estra forms areas related with itself like on Surveys areas.
*/
var FormsActivateRelated = function(options){
	options = _.extend({}, options);
	var _self = this;
	this.obj = options.obj;
	this.defaul_parent_limiter = this.obj.dataset.hasOwnProperty('parentlimiter') ? '.'+this.obj.dataset.parentlimiter : '.form-group';

	this.obj_checked = this.obj.checked;
	this.obj_container = $(this.obj).closest(this.defaul_parent_limiter);

	this.related_obj = [];
	$.each(this.obj.dataset.controlfield.split(','), function(indx, value){
		_self.related_obj.push($('#id_'+value));
		if($('#id_'+value).prop('checked')){
			$(_self.obj).prop('checked', 'checked');
			_self.obj_checked = true;
		}
	});
	this.related_obj_container = this.related_obj[0].closest(this.defaul_parent_limiter);
	this.init_events();

	if (!this.obj_checked)
		this.related_obj_container.addClass('hidden');
};

FormsActivateRelated.prototype.init_events = function(){
    var _self = this;
    _self.obj_container.on('change', $(_self.obj), function(event){
        _self.toggle(event);
    });
};

FormsActivateRelated.prototype.toggle = function(event){
    if (this.obj_checked){
        this.related_obj_container.addClass('hidden');
        this.obj_checked = false;
    }
    else{
        this.related_obj_container.removeClass('hidden');
        this.obj_checked = true;
    }

    $.each(this.related_obj, function(indx, value){
        if(value.attr('type')=='checkbox'){
            if($(value).prop('checked'))
                $(value).trigger('change');
            $(value).prop('checked', false);
        }
        else if(!$(value).hasClass('protect_clear'))
            $(value).val('');
    });
};

var default_form_focus;
/*
    This method will focus the cursor on a default or wanted form on every page
*/
var FormAutoFocus = function(options){
    options = $.extend({}, options);
    var form_identifier = options.hasOwnProperty('form_identifier') ? options.form_identifier : undefined;
    var form_field = options.hasOwnProperty('form_field') ? options.form_field : undefined;
    this.__seek_form(form_identifier);
    this.__seek_field(form_field);
    this.do_focus();
};

/*
    Params:
        - form_identifier: can be a class or an id
*/
FormAutoFocus.prototype.__seek_form = function(form_identifier){
    // Use a default value
    f_class = form_identifier === undefined ? '.dev__main_form' : form_identifier;

    this.form_default = $('form'+ f_class).get(0);
    if (form_identifier === undefined){
        this.form_default = $('form').get(0);
    }
    this.form_default = $(this.form_default);
};

FormAutoFocus.prototype.__seek_field = function(form_field){
    // Use a default value
    form_field = form_field === undefined ? 'dev__default_focus' : form_field;

    f_field = this.form_default.find('input.'+form_field).get(0);
    if (f_field === undefined){
        f_field = this.form_default.find('input:textall').get(0);
    }

    if (_.isUndefined(f_field)){
        return;
    }
    if(f_field.value.length !== 0){
        f_field.selectionStart = f_field.value.length;
        f_field.selectionEnd = f_field.value.length;
    }

    this.f_field = $(f_field);
};

FormAutoFocus.prototype.refresh = function(form_identifier, form_field){
    if (!$('form'+form_identifier).is(':visible')){
        this.__seek_form();
        this.__seek_field();
    }
    else{
        this.__seek_form(form_identifier);
        this.__seek_field(form_field);
    }
    this.do_focus();
};

FormAutoFocus.prototype.do_focus = function(){
    if (this.f_field !== undefined){
        this.f_field.focus();
    }
};
