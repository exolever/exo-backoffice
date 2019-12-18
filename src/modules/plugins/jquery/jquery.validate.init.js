$(function(){
    $.extend($.validator.messages, { url: "Please enter a valid URL, starts with http:// or https://" });
    //add the custom validation method
    $.validator.addMethod("minWordCount",
       function(value, element, params) {
          var count = getWordCount(value);
          if(count >= params) {
             return true;
          }
       },
       "A minimum of {0} words is required here."
    );
    //add the custom validation method
    $.validator.addMethod("maxWordCount",
       function(value, element, params) {
          var count = getWordCount(value);
          if(count <= params) {
             return true;
          }
       },
       "A maximum of {0} words is required here."
    );
     //add the custom validation method
    $.validator.addMethod("wordCount",
       function(value, element, params) {
          var count = getWordCount(value);
          if(count >= params[0] && count <= params[1]) {
             return true;
          }
       },
       "A minimum/maximum of {0} words is required here."
    );
});

function getWordCount(wordString) {
  var words = wordString.split(" ");
  words = words.filter(function(words) {
    return words.length > 0;
  }).length;
  return words;
}


