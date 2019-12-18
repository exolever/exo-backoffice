var FeedbackForm = function(){
    this.$el = $('#feedback_container');
    this.$form = $('#feedback_form');
    this.open = false;
    this.init_events();
};

FeedbackForm.prototype.init_events = function(){
    var _self = this;
    this.$el.find('.dev__header').click(function(event){
        if (_self.open){
            _self.do_close();
        } else{
            _self.do_open();
        }
    });
    this.$form.submit(function(event){
        event.preventDefault();
        _self.submit();
    });
};

FeedbackForm.prototype.do_open = function(){
    this.$el.removeClass().addClass(
        'bounceInUp open animated').one(
        'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
            $(this).removeClass('bounceInUp');
        });
    this.open = true;
};

FeedbackForm.prototype.do_close = function(){
    this.$el.addClass(
        'bounceOutDown animated').one(
        'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
            $(this).removeClass('bounceOutDown open');
        });
    this.open = false;
    this.$form[0].reset();
};

FeedbackForm.prototype.submit = function(){
    var data = {};
    data.message = this.$form.find('#id_feedback_message').val();
    if ($('input#id_feedback_file')[0].files.length > 0){
        data.attachment = this.$form.find('input#id_feedback_file')[0].files[0];
    }
    var options = {};
    var formData = new FormData();
    _.each(data, function(value, key){
        formData.append( key, value );
    }, this);

    var l = this.$form.find("button").ladda();
    l.ladda('start');
    // Set options for AJAX call
    options.data = formData;
    options.processData = false;
    options.contentType = false;
    options.url = urlservice.resolve('feedback');
    options.method = 'POST';
    options.success = _.bind(this.submit_ok, this);
    options.error = _.bind(this.submit_error, this);
    $.ajax(options);
};

FeedbackForm.prototype.submit_ok = function(data){
    var l = this.$form.find("button").ladda();
    l.ladda('stop');
    toastr_manager.show_message('success', '', 'Your message was sent successfully');
    this.do_close();
};

FeedbackForm.prototype.submit_error = function(data){
    toastr_manager.show_message('error', '', 'Something was wrong, please wait');
    this.do_close();
};
