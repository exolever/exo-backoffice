(function(Backbone) {
    var PreviewInvitationView = Backbone.BootstrapContentModalForm.extend({
        template: templates.invitation_preview,
        initialize: function(options){
            this.data = options.data;
        },
        render: function(){
            var html = this.template(this.data);
            this.$el.html(html);
            return this.$el;
        }
    });
    if (typeof window.View === 'undefined') window.View = {};
    window.View.PreviewInvitation = PreviewInvitationView;
})(Backbone);
