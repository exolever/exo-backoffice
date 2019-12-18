(function(Backbone) {
    var template = _.template("<p>Are you sure you want to delete \" <%= msg %>\"?</p>");
    var DeleteConfirmModal = Backbone.BootstrapContentModalForm.extend({
        template: template,
        initialize: function(options){
            this.msg = options.msg;
            this.channel = options.channel;
            this.msg_name = options.msg_name || "remove-item";
            this.model = options.model;
        },
        render: function(){
            var _self = this;
            this.$el.html(this.template({msg: this.msg}));
        },
        save: function(){
            this.channel.trigger(this.msg_name, this.model);
        }
    });
    Backbone.BootstrapDeleteConfirmModal = DeleteConfirmModal;
})(Backbone);
