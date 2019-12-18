(function(Backbone){

    if (typeof window.Model == 'undefined') window.Model = {};

    window.Model.SurveyTemplate = Backbone.Model.extend({
        url: function(){
            return urlservice.resolve('api-survey-template');
        },
        toString: function() {
            return this.get("name");
        },
        parse: function(response, options){
            var hash = Backbone.Model.prototype.parse.apply(this, arguments);
            var sections = new window.Collection.SectionSurvey();
            sections.reset(response.sections);
            hash.sections = sections;
            return hash;
        },
    });

    window.Model.SectionSurvey = Backbone.Model.extend({
        toString: function(){
            return this.get('name');
        }
    });

    window.Model.SurveyResponse = Backbone.Model.extend({
        url: function(){
            return urlservice.resolve('api-survey-fill',
                                      this.get('hash'));
        },
        responses_toJSON: function(){
            var responses = [];
            var responses_t = this.toJSON();
            delete responses_t.hash;
            delete responses_t.survey_template;
            _.each(responses_t, function(value, key){
                responses.push({
                    'name': key.toString(),
                    'value': value.toString()
                });
            });
            return JSON.stringify(responses);
        }
    });

    if (typeof window.Collection == 'undefined') window.Collection = {};

    window.Collection.SurveyTemplate = Backbone.Collection.extend({
        model: window.Model.SurveyTemplate,
        url: function(){
            return urlservice.resolve('api-survey-template');
        }
    });

    window.Collection.SectionSurvey = Backbone.Collection.extend({
        model: window.Model.SectionSurvey
    });

})(Backbone);
