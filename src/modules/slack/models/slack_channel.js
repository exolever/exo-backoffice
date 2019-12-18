(function(Backbone) {

    var SlackChannelCollection = Backbone.Collection.extend({
        initialize: function(elements, options){
            this.url = options.url;
        }
    });

    if (typeof window.Collection === 'undefined') window.Collection = {};
    window.Collection.SlackChannel = SlackChannelCollection;
})(Backbone);
