(function(Backbone) {

    var MessagesCollectionView = Backbone.View.extend({
        el: "#dev__container_messages",
        template: templates.thread_detail,
        initialize: function(options){
            this.messages = [];
        },
        render: function(){
            this.$el.clear();
            return this.$el;
        },
        add_messages: function(messages){
            this.messages = messages;
            var data = {};
            data.subject = messages[0].subject;
            data.from_header = messages[0].from_address;
            data.date = messages[0].date;
            data.messages = messages;
            var html = this.template(data);
            this.$el.html(html);
            return this.$el;
        }
    });
    if (typeof window.View === 'undefined') window.View = {};
    window.View.MessageCollection =MessagesCollectionView;
})(Backbone);
