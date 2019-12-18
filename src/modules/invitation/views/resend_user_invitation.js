var ResendInvitationUser = function(){
    this.initialize();
    this.init_events();
};

ResendInvitationUser.prototype.initialize = function(){
    this.channelName = 'invitation';
    this.invitationChannel = Backbone.Radio.channel(this.channelName);
    this.invitationChannel.on('resend-user', _.bind(this.processResendUser, this));
};

ResendInvitationUser.prototype.init_events = function(){
    var _self = this;
    $('body').on('click', '.dev__resend_user_invitation_btn', function(event){
        event.preventDefault();
        var invitation_id = $(event.currentTarget).data('pk');
        var email = $(event.currentTarget).data('email');
        _self.show_modal(invitation_id, email);
    });
};

ResendInvitationUser.prototype.show_modal = function(invitation_id, email){
    var view = new window.View.ResendUserInvitation({
        invitation_pk: invitation_id,
        email:  email,
        channelName: this.channelName
    });
    var modal = new Backbone.BootstrapModal({
        content: view,
        title: "Resend Invitation",
        animate: true,
        okText: 'Save'
    });
    modal.open();
};

ResendInvitationUser.prototype.processResendUser = function(data){
    var url = urlservice.resolve('resend-user-invitation', data.invitation_pk);
    $.ajax({
        type: 'put',
        url: url,
        data: {email: data.email},
        success: function(){
            toastr_manager.show_message('success','', 'Invitation resend successfully');
        },
        error: function(data){
            toastr_manager.show_message('error','', data.responseJSON.non_field_errors[0]);
        }
    });
};
