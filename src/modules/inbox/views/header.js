var HeaderUnreadEmailView = function(){
    this.$container = $('#dev__total_unread');
    // Inbox enabled
    if ($("#dev__enable_inbox").length > 0 ){
        this.getUnread();
    }
};

HeaderUnreadEmailView.prototype.getUnread = function(){
    var inbox_url = exo_settings.get('inbox-url');
    if (!inbox_url){
        return;
    }
    var url = inbox_url + "/inbox/api/mailbox/unread/";
    $.get(url, _.bind(this.showSuccessUnread, this));
};

HeaderUnreadEmailView.prototype.showSuccessUnread = function(data){
    this.$container.html(data.total);
};
