(function(Backbone) {
    var ComposeModalView = Backbone.BootstrapContentModalForm.extend({
        template: templates.modal_compose,
        initialize: function(options){
            this.channelName = options.channelName;
            this.model = options.model;
        },
        render: function(){
            var data = {subject: '', to: ''};
            if (this.model){
                data.subject = "Re: " + this.model.get('subject');
                data.to = this.model.get('to');
            }
            this.$el.html(this.template(data));
            return this.$el;
        },
        save: function(){
            var subject = this.$el.find("#id_subject").val();
            var email = this.$el.find("#id_to").val();
            var body = this.$el.find("#id_body").val();
            var data = {
                subject: subject,
                to: email,
                body: body
            };
            var channel = Backbone.Radio.channel(this.channelName);
            channel.trigger('compose', data, this.model);
        }
    });
    if (typeof window.View === 'undefined') window.View = {};
    window.View.ComposeEmailModal = ComposeModalView;
})(Backbone);
