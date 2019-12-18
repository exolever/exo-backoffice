(function(Backbone) {
    var ResendUserInvitationView = Backbone.BootstrapContentModalForm.extend({
        template: templates.resend_invitation_user,
        initialize: function(options){
            this.email = options.email;
            this.invitation_pk = options.invitation_pk;
            this.channelName = options.channelName;
            this.invitationChannel = Backbone.Radio.channel(this.channelName);
        },
        render: function(){
            var data = {};
            data.email = this.email;
            var html = this.template(data);
            this.$el.html(html);
            return this.$el;
        },
        save: function(){
            var email = this.$el.find("#id_email").val();
            var data = {};
            data.invitation_pk = this.invitation_pk;
            data.email = email;
            this.invitationChannel.trigger('resend-user', data);
        }
    });
    if (typeof window.View === 'undefined') window.View = {};
    window.View.ResendUserInvitation = ResendUserInvitationView;
})(Backbone);
