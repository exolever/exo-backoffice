var FilterActions = function(){
    this.$el = $('#filter-actions');
    this.$form = $('.dev__form_filter');
    this.init_events();
};

FilterActions.prototype.init_events = function(){
    var _self = this;
    this.$el.find('.dev__action').click(function(event){
        event.preventDefault();
        var url = $(event.currentTarget).data('url');
        var data = $(event.currentTarget).data();
        var extra_data = "";
        _.each(data, function(value, key){
            if (key !== 'url'){
                extra_data = extra_data + "&" + key + "=" + value;
            }
        });
        _self.send_filter(url, extra_data);
    });
};

FilterActions.prototype.send_filter = function(url, extra_data){
    var data = this.$form.serialize();
    var href = url + "?" + data + extra_data;
    location.href = href;
};
