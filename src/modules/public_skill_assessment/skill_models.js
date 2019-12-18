(function(Backbone){

    if (typeof window.Model == 'undefined') window.Model = {};

    window.Model.SkillAssessmentTemplate = Backbone.Model.extend({
        url: function(){
            return urlservice.resolve('skill-template');
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

    window.Model.SectionSkillAssessment = Backbone.Model.extend({
        toString: function(){
            return this.get('name');
        }
    });

    window.Model.SkillAssessmentResponse = Backbone.Model.extend({
        url: function(){
            if (this.get('id')){
                return urlservice.resolve(
                    'skill-assessment-detail',
                    this.get('id'));
            } else{
                return urlservice.resolve(
                    'invitation-skill-accept',
                    this.get('invitation_id'));
            }
        },
        get_value: function(name){
            responses = _.filter(this.get('responses'), function(response){return response.name === name;});
            response = responses[0];
            switch(response.type_question){
                case 'C':
                    return response.values;
                case 'I':
                    return response.value_string;
                case 'S':
                case 'R':
                    return response.value;
            }
        },
        fields_no_skill: [
            'template', 'name',
            'country', 'languages'
        ],
        save_response: function(callback){
            var data = {};
            _.each(this.fields_no_skill, function(field){
                data[field] = this.get(field);
            }, this);
            var responses = this.responses_toJSON();
            data.responses = responses;
            var options = {success:callback};
            options.data = JSON.stringify(data);
            options.contentType = 'application/json';
            this.sync('update', this, options);
        },
        responses_toJSON: function(){
            var responses = [];
            _.each(this.get('responses'), function(response){
                name = response.name;
                value = this.get(name);
                responses.push({
                    'name': name,
                    'value': value
                });
            }, this);
            return responses;
        },
        init_from_invitation: function(options){
            var invitation_id = options.invitation_id;
            var questions = options.questions;
            _.each(questions, function(question){
                question.name = question.slug;
            }, this);
            this.set('responses', questions);
            this.set('invitation_id', invitation_id);
            this.trigger('sync');
        }
    });

    if (typeof window.Collection == 'undefined') window.Collection = {};

    window.Collection.SkillAssessmentTemplate = Backbone.Collection.extend({
        model: window.Model.SkillAssessmentTemplate,
        url: function(){
            return urlservice.resolve('skill-template');
        }
    });

    window.Collection.SectionSkillAssessment = Backbone.Collection.extend({
        model: window.Model.SectionSkillAssessment
    });

})(Backbone);
