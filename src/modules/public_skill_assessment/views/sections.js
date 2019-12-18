(function(Backbone){
    var SkillStep1 = Backbone.View.extend({
        mixins: ['validation_skill'],
        template: templates.public_skill_assessment_wizard_first_step,
        initialize: function(model){
            this.model = model;
        },
        render: function(){
            var data = {};
            data.languages = new window.Collection.Language();
            data.languages.fetch({async: false});
            data.countries = settings.countries;
            var template = templates.public_skill_assessment_wizard_first_step;
            return template(data);
        },
        validate: function(errors){
            if (!this.validate_input('name')){
                errors.push('name');
                this.mark_error({slug: 'name'});
            }
            if (!this.validate_radio_checkbox('languages')){
                errors.push('languages');
                this.mark_error({slug: 'languages'});
            }
            if (!this.validate_select('country')){
                errors.push('country');
                this.mark_error({slug: 'country'});
            }
        },
        save: function(skill){
            skill.set('name', this.validate_input('name'));
            skill.set('country', this.validate_select('country'));
            skill.set('languages', this.value_radio_checkbox('languages'));
        },
        set_initial: function(skill){
            $("input[name='name']").val(skill.get('name'));
            $("select[name='country']").val(skill.get('country')).trigger('change');
            _.each(skill.get('languages'), function(l){
                $("input[name='languages'][value='" + l + "']").iCheck('check');
            }, this);
        }
    });

    var SkillDefaultView = Backbone.View.extend({
        mixins: ['validation_skill'],
        validate: function(errors){},
        save: function(skill){},
        set_initial: function(skill){},
        render: function(){return "";}
    });

    var SkillAssesmentSectionView = Backbone.View.extend({
        mixins: ['validation_skill'],
        tagName: 'div',
        className: 'step_body',
        template: templates.public_skill_assessment_wizard_step,
        initialize: function(options){
            this.model = options.model;
            this.skill = options.skill;
            this.listenTo(this.skill, 'sync', this.set_initial);
            if (this.is_step_1()){
                this.embedded_view = new SkillStep1({model: this.model});
            } else{
                this.embedded_view = new SkillDefaultView();
            }
        },
        is_step_1: function(){
            return this.model.get('order') === 1;
        },
        get_context_data: function(model){
            var data = model.toJSON();
            data.template = this.embedded_view.render();
            return data;
        },
        render: function(){
            this.$el.attr('id','wizard-p-' + this.model.get('order'));
            var data = this.get_context_data(this.model);
            var html = this.template(data);
            this.$el.append(html);
            this.model.view = this;
            _.each(this.model.get('questions'), function(question){
                if (question.type_question === 'C'){
                    $(document).on(
                        'ifClicked',
                        "input[name=" + question.slug + "]",
                        _.bind(this.check_max_options, this));
                }
            }, this);
            return this.$el;
        },
        check_max_options: function(event){
            var elem = $(event.currentTarget);
            var name = event.currentTarget.name;
            var max_options = elem.data('maxoptions');
            var siblings = $("input[name=" + name + "]").parent().filter(".checked").length;
            if (siblings >= max_options){
                $("input[name=" + name + "]").parent().filter(".checked").find("input").not("[value=" + elem.val() + "]").iCheck('uncheck');
            }
        },
        commit: function(){
            var errors = this.validate();
            if(_.isEmpty(errors)){
                this.save();
            }
            return errors;
        },
        validate: function(){
            this.clean_error();
            var errors = [];
            _.each(this.model.get('questions'), function(question){
                var selected = false;
                switch(question.type_question){
                    case 'C':
                    case 'R':
                        selected = this.validate_radio_checkbox(question.slug);
                        break;
                    case "S":
                        selected = this.validate_select(question.slug);
                        break;
                    case "I":
                        selected = this.validate_input(question.slug);
                        break;
                }

                if(!selected && question.required){
                    errors.push(question);
                    this.mark_error(question);
                }
            }, this);
            this.embedded_view.validate(errors);
            return errors;
        },
        save: function(){
            _.each(this.model.get('questions'), function(question){
                var value;
                switch(question.type_question){
                    case 'C':
                    case 'R':
                        value = this.value_radio_checkbox(question.slug);
                        break;
                    case "S":
                        value = [this.validate_select(question.slug)];
                        break;
                    case "I":
                        value = [this.validate_input(question.slug)];
                        break;
                }
                question.value = value;
                this.skill.set(question.slug, question.value);
            }, this);
            this.embedded_view.save(this.skill);
        },
        set_initial: function(){
            this.embedded_view.set_initial(this.skill);
            _.each(this.model.get('questions'), function(question){
                var value = this.skill.get_value(question.slug);
                switch(question.type_question){
                    case 'C':
                        _.each(value, function(l){
                            $("input[name='" + question.slug + "'][value='" + l + "']").iCheck('check');
                        });
                        break;
                    case 'R':
                        $("input[name='" + question.slug + "'][value='" + value + "']").iCheck('check');
                        break;
                    case "S":
                        $("select[name='" + question.slug + "']").val(value).trigger('change');
                        break;
                    case "I":
                        $("input[name='" + question.slug + "']").val(value).trigger('change');
                        break;
                }
            }, this);
        }
    });
    if (typeof window.View == 'undefined') window.View = {};
    window.View.SkillAssesmentSection = SkillAssesmentSectionView;
})(Backbone);
