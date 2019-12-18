(function(Backbone) {
    var TimeSlotItemView = Backbone.View.extend({
        tagName: 'form',
        className: 'pull-left',
        template: templates.time_slot,
        events: {
            'click .delete': 'delete_item'
        },
        initialize: function(options){
            this.model = options.model;
            this.listenTo(this.model, 'change:position', this.refresh_position);
        },
        render: function(){
            var data = this.model.toJSON();
            data.cid = this.model.cid;
            var html = this.template(data);
            this.$el.html(html);
            this.validate();
            this.$el.find('.datepicker').datepicker(datepicker.options);
            this.$el.find('.clockpicker').clockpicker();
            return this.$el;
        },
        close: function(event){
            this.remove();
            this.unbind();
        },
        validate: function(){
            this.$el.validate();
        },
        is_valid: function(){
            return this.$el.valid();
        },
        delete_item: function(){
            this.model.collection.remove(this.model);
        },
        save: function(){
            if (this.is_valid()){
                this.model.set('date', this.$el.find('#id_date_' + this.model.cid).val());
                this.model.set('time', this.$el.find('#id_time_' + this.model.cid).val());
            }
        },
        refresh_position: function(model){
            this.$el.find("#cnt-position").html("Option " + model.get('position'));
        }
    });

    var TimeSlotCollectionView = Backbone.View.extend({
        el: '#time-slots',
        events: {
            'click .add-new': 'add_new'
        },
        initialize: function(options){
            this.model = options.model;
            this.collection = options.collection;
            this.total = options.total;
            this._views = {};
            this.listenTo(this.collection, 'add', this.add_model);
            this.listenTo(this.collection, 'remove', this.remove_model);
        },
        render: function(){
            this.collection.each(function(model){
                this.add_model(model);
            }, this);
        },
        add_model: function(model){
            var position = this.collection.length;
            model.set('position', position);
            var view = new TimeSlotItemView({model: model});
            var $el = view.render();
            this.$el.append($el);
            this._views[model.cid] = view;
            this.total.val(this.collection.length);
            return this.$el;
        },
        remove_model: function(model){
            var view = this._views[model.cid];
            view.close();
            this.total.val(this.collection.length);
            var position = 1;
            this.collection.each(function(model){
                model.set('position', position);
                position = position + 1;
            }, this);
        },
        add_new: function(event){
            event.preventDefault();
            var model = new Backbone.Model({date: "", time: ""});
            this.collection.add(model);
        },
        save: function(){
            _.each(this._views, function(view, key){
                view.save();
            }, this);
        }
    });

    if (typeof window.View === 'undefined') window.View = {};
    window.View.TimeSlotCollectionView = TimeSlotCollectionView;
    window.View.TimeSlotItemView = TimeSlotItemView;
})(Backbone);
