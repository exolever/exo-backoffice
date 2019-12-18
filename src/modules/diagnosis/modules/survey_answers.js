(function(Backbone) {
    if (typeof window.Model == 'undefined') window.Model = {};
    window.Model.SurveyResponseAnswers = Backbone.Model.extend({
        url: function(){
            return urlservice.resolve('api-survey-answers',
                                      this.get('id'));
        }
    });
})(Backbone);
