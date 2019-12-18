(function(Backbone) {
    var MessageModel = Backbone.Model.extend({
        url: function(){
            var url = exo_settings.get('inbox-url') + "/inbox/api/compose/";
            if (this.id){
                url = url + this.id + "/";
            }
            return url;
        },
        toString: function(){
            return this.get('subject');
        },
        reply: function(success_ballback){
            var url = this.url() + "reply/";
            $.post(url, this.toJSON(), success_ballback);
        }
    });
    if (typeof window.Model === 'undefined') window.Model = {};
    window.Model.Message = MessageModel;
})(Backbone);
