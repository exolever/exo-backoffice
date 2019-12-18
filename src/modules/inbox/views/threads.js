(function(Backbone) {

    var ThreadCollectionView = Backbone.View.extend({
        el: "#dev__container_thread",
        initialize: function(options){
            this.collection = new window.Collection.Thread();
            this.listenTo(this.collection, 'add', this.addOne);
            this._views = {};
            this.channelName = options.channelName;
        },
        render: function(){
            this.collection.fetch();
            return this.$el;
        },
        addOne: function(model){
            var view = new window.View.ThreadItem({
                model: model,
                channelName: this.channelName});
            view.render();
            this.$el.append(view.$el);
            this._views[model.id] = view;
        }
    });
    if (typeof window.View === 'undefined') window.View = {};
    window.View.ThreadCollection =ThreadCollectionView;
})(Backbone);
