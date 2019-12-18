(function(Backbone) {
    var ThreadModel = Backbone.Model.extend({
        url: function(){
            var url = exo_settings.get('inbox-url') + "/inbox/api/inbox/";
            if (this.id){
                url = url + this.id + "/";
            }
            return url;
        },
        toString: function(){
            return this.get('subject');
        },
        load_thread: function(success_callback){
            var url = this.url();
            $.get(url, success_callback);
        }
    });
    var ThreadCollection = Backbone.Collection.extend({
        model: ThreadModel,
        url: function(){
            return exo_settings.get('inbox-url') + "/inbox/api/inbox/";
        }
    });
    if (typeof window.Model === 'undefined') window.Model = {};
    if (typeof window.Collection === 'undefined') window.Collection = {};
    window.Model.Thread = ThreadModel;
    window.Collection.Thread = ThreadCollection;
})(Backbone);
