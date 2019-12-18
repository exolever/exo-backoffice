/*

Sort elements Class

*/
var sortable_user_list;

var SortableUserList = function(options){
    options = _.extend({}, options);
    this.initialize(options);
};

SortableUserList.prototype.initialize = function(options){
    options = _.extend({}, options);
    this.children_class = options.hasOwnProperty('children_class') ? options.children_class : 'draggable';

    this.container_tag = options.hasOwnProperty('container_tag') ? options.container_tag : '.dev__sortable_user_list >tbody';
    this.sortable = $(this.container_tag);

    this.url = urlservice.resolve('add-order',
                                  this.sortable.data('project_id'));

    this.init();
    this.init_events();
};

SortableUserList.prototype.init = function(){
    $(this.sortable).sortable({
                tolerance: 'pointer',
                forcePlaceholderSize: true,
                opacity: 0.8
            }).disableSelection();
    $(this.sortable).sortable(
        "option",
        "helper",
        _.bind(this.object_helper, this)
    );
    // Add custom class to sorted elements
    $.each($(this.sortable).children(),
           _.bind(this.add_class, this)
    );
};

SortableUserList.prototype.init_events = function(){
    /*
    Bind events for sortable ui
    */
    $(this.sortable).on('sortstop', _.bind(this.dropped, this));
    $(this.sortable).on('sortstart', _.bind(this.start_move, this));
};

SortableUserList.prototype.object_helper = function(event, ui){
    var element = ui.clone();
    while($(element).children().length > 2){
        $(element).children()[2].remove();
    }
    return $(element);
};

SortableUserList.prototype.add_class = function(index, object){
    $(object).addClass(this.children_class);
    var children = $(object).children()[0];
    $(children).prepend("<a href='#' class='dots'></a>");
};

SortableUserList.prototype.start_move = function(event, ui){
    $(ui.item).attr('data-previndex', ui.item.index());
};

SortableUserList.prototype.dropped = function(event, ui){
    /*
    Sortable element dropped
    */
    var _this = this;
    var new_position = ui.item.index();
    if ($(ui.item).data('previndex') != new_position){
        var data = {
            content_type: ui.item.data('content_type_id'),
            object_id: ui.item.data('object_id'),
            order: new_position + 1
        };
        $.ajax({
            url: _this.url,
            method: 'POST',
            data: data,
            success: _.bind(_this.sort_done, this),
            error: _.bind(_this.sort_error, this)
        });
    }
};

SortableUserList.prototype.sort_done = function(data, textStatus, jqXHR){
    // Do stuff
};

SortableUserList.prototype.sort_error = function(jqXHR, textStatus, errorThrownText){
    toastr_manager.show_message(
        'error',
        'The action could not be done!',
        'Error'
    );
};
