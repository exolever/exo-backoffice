
var BulkActions = function(options){
    /*
        Options params:
            - form_id: form id for the bulkaction form
            - object_list_tag: HTML tag for objects list
            - object_list_class: container where objects list lives
    */

    options = _.extend({}, options);
    options = _.extend(
        {'form_id': options.hasOwnProperty('form_id') ? options.form_id : 'bulkaction-form',
         'object_list_tag': options.hasOwnProperty('object_list_tag') ? options.object_list_tag : 'table',
         'object_list_class': options.hasOwnProperty('object_list_class') ? options.object_list_class : 'list-detail'
        },
        options);

    this.form = $('form#' + options.form_id);
    this.$el = this.form.parent();
    if (this.$el.length !== 0){
        this.object_list = $(options.object_list_tag + '.' + options.object_list_class);

        this.init_events();
        this.object_list.find('.i-checks').iCheck(icheck_options.get_defaults());
    }
};

BulkActions.prototype.init_events = function(options){
    var _this = this;

    _this.object_list.on(
        'ifChanged',
        '.i-checks',
        function(event){
            _this.update_objects_selected(event);
        }
    );
    _this.$el.on('submit',
        'form',
        function(event){
            _this.submit_form(event);
        }
    );

};

BulkActions.prototype.submit_form = function(event){
    this.can_submit() ? null : event.preventDefault();
};

BulkActions.prototype.can_submit = function(event){
    return ((this.get_action_selected() !== null) && (this.get_objects_selected().length !== 0));
};

BulkActions.prototype.update_objects_selected = function(){
    var object_list_input = this.form.find('input#id_object_list');
    var object_list = '';
    $.each(this.get_objects_selected(), function(index, object){
        object_list += object_list !== '' ? ',' + object : object;
    });
    object_list_input.val(object_list);
};

BulkActions.prototype.get_objects_selected = function(){
    var _this = this;
    var object_list = [];
    $.each(_this.object_list.find('input[type=checkbox]:checked'), function(index, object){
        object_list.push($(object).prop('id'));
    });
    return object_list;
};

BulkActions.prototype.get_action_selected = function(){
    var action = this.form.find('select#id_actions :selected').val();
    return action !== '' ? action : null;
};
