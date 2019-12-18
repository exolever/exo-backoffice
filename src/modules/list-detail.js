//
// Library to manage List-Detail View
//
/*
    options: {
        - element: id for building the list-detail view.
        - triggerName: name of role for trigger the action (default 'trigger').
        - triggerCloseName: name of role for trigger the close detail (default 'close-detail')
    }

    Structure:
        <div data-role="list">...</div>
        <div data-role="detail">...</div>
    Params of them:
        data-list: list of class when detail is closed.
        data-detail: list of class when detail is opened.
    Actions:
        data-action: action when user click. Default open detail and inject
            content from data-url. stop when you don't want to trigger Click.

*/


var ListDetailView = function(options){
    var $element = $(options.element);
    this.CH_OPENED = 'opened';
    this.CH_CLOSED = 'closed';
    this.status = options.status || this.CH_CLOSED;
    this.triggerName = options.triggerName || "trigger";
    this.triggerCloseName = options.triggerCloseName || "close-detail";
    this.$container = $element;
    this.$list = $element.find('[data-role=list]').eq(0);
    this.$detail = $element.find('[data-role=detail]').eq(0);
    this.channel = Backbone.Radio.channel('master-detail');
    this.init_events();
    this.open_default();
    this.init_table_order();
};

ListDetailView.prototype.init_events = function(){
    //Init events
    var _self = this;
    var selector = "[data-role=" + this.triggerName + "]";
    this.$container.on('click', selector, function(event){
        //Avoid call when is a dropdown
        var el_clicked = $(event.target);
        var elem = $(event.target).parents('[data-action]');
        if ((elem.data('action') === 'stop') || (el_clicked.data('action') === 'stop')){
            return;
        }
        if (analytics.woopra){
            woopra.track("see-detail", {
                section: window.location.pathname,
                object: $(event.currentTarget).data('url')
            });
        }
        _self.show_detail($(event.currentTarget));
    });
    var selector_close = "[data-role=" + this.triggerCloseName + "]";
    this.$container.on('click', selector_close, function(event){
        _self.togglePanel();
    });
    var selector_order = "[data-role=order] > th";
    this.$container.on('click', selector_order, function(event){
        _self.orderTable(event);
    });
    //Submenu
    this.$container.find('[data-submenu]').submenupicker();
};

ListDetailView.prototype.is_opened = function(){
    return this.status === this.CH_OPENED;
};

ListDetailView.prototype.show_detail = function(element){
    //Show detail
    if (!this.is_opened()){
        this.togglePanel();
    }
    element.siblings().removeClass('active');
    element.addClass('active');
    this.show_content(element);
};

ListDetailView.prototype.togglePanel = function(){
    //Open and close Detail Panel
    var from_class = this.$list.data('list');
    var to_class = this.$list.data('detail');
    this.$list.toggleClass(from_class + " " + to_class);
    from_class = this.$detail.data('list');
    to_class = this.$detail.data('detail');
    this.$detail.toggleClass(from_class + " " + to_class);
    if (this.is_opened()){
        this.status = this.CH_CLOSED;
    }
    else{
        this.status = this.CH_OPENED;
    }
};

ListDetailView.prototype.show_content = function(element){
    //Empty current content and load new one.
    var _self = this;
    this.$detail.off();
    var template = templates.spinner_detail;
    this.$detail.html(template);
    this.adjust_height();
    $.get(element.data('url'), function(content){
        _self.$detail.empty();
        _self.$detail.append(content);
        _self.channel.trigger('detail-opened');
        _self.adjust_height();
        _self.$detail.find('a[data-toggle="tab"]').on(
            'shown.bs.tab',
            _.bind(_self.adjust_height, _self)
        );
        //Submenu
        _self.$detail.find('[data-submenu]').submenupicker();
    });
};

ListDetailView.prototype.adjust_height = function(){
    //Adjust height of list and detail views
    this.$list.find("> div").height("auto");
    this.$detail.find("> div").height("auto");
    var height1 = this.$list.find("> div").height();
    var height2 = this.$detail.find("> div").height();
    if (height1 > height2){
        this.$detail.find("> div").height(height1);
    }
    else{
        this.$list.find("> div").height(height2);
    }
};

ListDetailView.prototype.show_object = function(object_pk){
    //Open Detail View from an object pk
    var selector = "[data-role=" + this.triggerName + "]";
    selector = selector +  " [data-pk=" + object_pk + "]";
    this.$container.find(selector).click();
};

ListDetailView.prototype.open_default = function(){
    // Open detail view based on local Storage
    var detail_pk = exoStorage.get('detail-pk');
    if (detail_pk){
        exoStorage.remove('detail-pk');
        this.show_object(detail_pk);
    }
};

ListDetailView.prototype.orderTable = function(event){
    var field_name = $(event.currentTarget).data('field');
    var current_field = $('#id_order_by').val().replace("-", "");
    var current_value = $('#id_order_by').val();
    if (current_field === field_name){
        if (_.startsWith(current_value, "-")){
            current_value = _.replaceAll(current_value, "-", "");
        }
        else{
            current_value = "-" + current_value;
        }
    }
    else{
        current_value = field_name;
    }
    $('[name=order_by]').val(current_value);
    $('.dev__form_filter.current').submit();
};

ListDetailView.prototype.init_table_order = function(){
    if ($('#id_order_by').length > 0 ){
        var current_field = $('#id_order_by').val().replace("-", "");
        var current_value = $('#id_order_by').val();
        if (current_value){
            this.mark_order(current_field, current_value);
        }
    }
};

ListDetailView.prototype.mark_order = function(field_name, value){
    this.$container.find("[data-role=order] > th > i").removeClass(
        "fa-sort-asc fa-sort-desc").addClass('fa-sort text-dark-gray');
    if (_.startsWith(value, "-")){
        this.$container.find("[data-role=order] > th[data-field=" + field_name + "] > i").removeClass(
        "fa-sort-asc fa-sort-desc fa-sort text-dark-gray").addClass('fa-sort-desc');
    }
    else{
        this.$container.find("[data-role=order] > th[data-field=" + field_name + "] > i").removeClass(
        "fa-sort-asc fa-sort-desc fa-sort text-dark-gray").addClass('fa-sort-asc');
    }
};
