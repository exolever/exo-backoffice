(function(){
    var RelatedMixinValidation = {
        validate_input: function(name){
            return $('input[name="' + name + '"]').val();
        },
        validate_radio_checkbox: function(name){
            return $('input[name="' + name + '"]:checked').length;
        },
        value_radio_checkbox: function(name){
            return $('input[name="' + name + '"]:checked').map(function() {
                return this.value;
            }).get();
        },
        validate_select: function(name){
            return $('select[name="' + name + '"]').val();
        },
        clean_error: function(){
            $('.container-answer label.error').remove();
        },
        mark_error: function(question){
            var html = "<label class='error no-margins no-padding full-width'>This field is required</label>";
            $(".form-group[data-name='" + question.slug + "']").find('.container-answer').prepend(html);
        }
    };

    Cocktail.mixins.validation_skill = RelatedMixinValidation;
})();
