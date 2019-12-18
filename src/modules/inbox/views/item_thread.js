(function(Backbone) {

    var ThreadItemView = Backbone.View.extend({
        template: this.templates.inbox_thread,
        tagName: 'li',
        events: {
            'click': 'load_thread'
        },
        className: 'list-group-item',
        initialize: function(options){
            this.model = options.model;
            this.channel = Backbone.Radio.channel(options.channelName);
        },
        render: function(){
            var html = this.template(this.model.toJSON());
            this.$el.html(html);
            return this.$el;
        },
        load_thread: function(){
            this.channel.trigger('show_thread', {model: this.model});
        }
    });
    if (typeof window.View === 'undefined') window.View = {};
    window.View.ThreadItem = ThreadItemView;
})(Backbone);
