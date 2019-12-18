(function(Backbone) {
    var TrainingModel = Backbone.Model.extend({
        toString: function(){
            return this.get('name');
        }
    });

    var TrainingCollection = Backbone.Collection.extend({
        model: TrainingModel,
        url: function(){
            return urlservice.resolve('training-session');
        }
    });

    var TrainedConsultantModel = Backbone.Model.extend({
        url: function(){
            if (this.id){
                return urlservice.resolve('consultant-trained-detail', this.get('consultant'), this.id);
            }
            else{
                return urlservice.resolve('consultant-trained', this.get('consultant'));
            }

        }
    });

    var TrainedConsultantCollection = Backbone.Collection.extend({
        model: TrainedConsultantModel,
        initialize: function(models, options){
            this.consultant_id = options.consultant_id;
        },
        url: function(){
            return urlservice.resolve('consultant-trained', this.consultant_id);
        }
    });
    if (typeof window.Model === 'undefined') window.Model = {};
    if (typeof window.Collection == 'undefined') window.Collection = {};
    window.Model.TrainingSession = TrainingModel;
    window.Model.TrainedConsultant = TrainedConsultantModel;
    window.Collection.TrainingSession = TrainingCollection;
    window.Collection.TrainedConsultant = TrainedConsultantCollection;
})(Backbone);

(function(Backbone) {
    var TrainedItemView = Backbone.View.extend({
        mixins: ['network_detail_itemview'],
        relatedModel: window.Model.TrainedConsultant,
        relatedField: 'training_session'
    });

    var TrainedConsultantListView = Backbone.View.extend({
        el: '#dev__trained',
        itemView: TrainedItemView,
        objectCollection: window.Collection.TrainingSession,
        objectConsultantCollection: window.Collection.TrainedConsultant,
        relatedField: 'training_session',
        mixins: ['network_detail_collectionview'],
    });

    if (typeof window.View === 'undefined') window.View = {};
    window.View.TrainedConsultant = TrainedConsultantListView;
})(Backbone);
