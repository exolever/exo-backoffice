(function($) {
    var HttpService = function(){
        this.headers = {
            "Accept-Language": "en",
        };
        this.ajax_setup();
    };

    // Update header with token
    HttpService.prototype.create_token = function(token){
        if (token) this.headers.Authorization = "JWT "+ token;
        this.ajax_setup();
    };

    HttpService.prototype.add_header = function(name, token){
        if (token) this.headers[name] = token;
        this.ajax_setup();
    };

    // Remove authorization
    HttpService.prototype.remove_token = function(){
        this.headers.Authorization = null;
        this.ajax_setup();
    };

    HttpService.prototype.ajax_setup = function(){
        $.ajaxSetup({
            headers: this.headers
        });
    };
    window.http_service = new HttpService();
})(jQuery);
