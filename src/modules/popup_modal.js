/**
 * Bootstrap Modal wrapper for use with Backbone.
 *
 * Takes care of instantiation, manages multiple modals,
 * adds several options and removes the element from the DOM when closed
 *
 * @author
 *
 * Options:
    elem: Select2 button that will be controlled
    options:
        - model
        - view
        - button_text

 * Events:
    open: Fired when the modal has finished animating in
    done: The user dismissed the modal
 */

var button_template = _.template("<div class='pull-right btn btn-default border-orange select2-button dev__select2btn' \
         id='select-file'><%=button_name %></div>");
var option_template = _.template("<option value='<%= id %>' selected><%= text %></option>")

var Select2Modal = function(elem, options){
    var _self = this;

    _self.$el = elem.parent('.form-group');

    // Transform into a select2 object
    elem.select2();

    _self.select2 = elem;

    // Initialize controller
    _self.initialize(options);

    // Render buttons
    _self.render();

    // Bind events
    _self.bind_events();
};

Select2Modal.prototype.initialize = function(options){
    var _self = this;
    this.message_done = options.message_done;
    this.button_name = options.button_name !== undefined ? options.button_name : 'Create new';
    this.model = new options.model();
    this.modal_view = options.view;

    this.select2Channel = Backbone.Radio.channel('select2');

    this.select2Channel.on('submit-data', _.bind(_self.done, _self));
};

Select2Modal.prototype.bind_events = function(){
    var _self = this;
    $(this.$el).on('click', '.dev__select2btn', function(evt){
        _self.open();
    });

};

Select2Modal.prototype.render = function(){
    // Render the button for the Select2
    var template = button_template({'button_name': this.button_name});
    var select2_container = this.select2.siblings('span.select2-container');
    var select2_span = this.select2.siblings('span.select2-container');
    $(select2_container).addClass('select2-modal');
    $(select2_span).after(template);

};

Select2Modal.prototype.open = function(){

    var view = new this.modal_view({
        channel: this.select2Channel,
        model: this.model
    });

    this.modal = new Backbone.BootstrapModal({
        content: view,
        title: this.button_name,
        animate: true,
        okText: 'Save'
    });

    this.modal.open();
};

Select2Modal.prototype.done = function(data){
    this.model.set(data);
    this.model.save([], {
        success: _.bind(this.sync_select2, this)
    });
};

Select2Modal.prototype.sync_select2 = function(model){
    var new_option = {'id': model.id,
                      'text': model.toString()};
    this.select2.append(option_template(new_option));
    this.select2.trigger('change.select2');
    toastr_manager.show_message('success', this.message_done);
};
