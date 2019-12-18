function parseURL(url) {
    var parser = document.createElement('a'),
        searchObject = {},
        queries, split, i;
    // Let the browser do the work
    parser.href = url;
    // Convert query string to object
    queries = parser.search.replace(/^\?/, '').split('&');
    for( i = 0; i < queries.length; i++ ) {
        split = queries[i].split('=');
        searchObject[split[0]] = split[1];
    }

    // We should manage the webcal format, the default behavior does not work correctly
    var pathname;
    if (parser.protocol === 'webcal:') {
        pathname = parser.pathname.substring(2);
    }
    else {
        pathname = parser.pathname;
    }

    return {
        protocol: parser.protocol,
        host: parser.host,
        hostname: parser.hostname,
        port: parser.port,
        pathname: pathname,
        search: parser.search,
        searchObject: searchObject,
        hash: parser.hash
    };
}


function move_to_first($parent, $element){
    $parent.prepend($element);
}

function markMatch (text, term) {
      // Find where the match is
    var match = text.toUpperCase().indexOf(term.toUpperCase());

    var $result = $('<span></span>');

    // If there is no match, move on
    if (match < 0) {
    return $result.text(text);
    }

    // Put in whatever text is before the match
    $result.text(text.substring(0, match));

    // Mark the match
    var $match = $('<span class="select2-rendered__match"></span>');
    $match.text(text.substring(match, match + term.length));

    // Append the matching text
    $result.append($match);

    // Put in whatever is after the match
    $result.append(text.substring(match + term.length));

    return $result;
}

/*
    Get level for an ExO value
*/
function get_level(level){
    if (level < 2){
        return 'Traditional linear approach';
    }
    else if (level < 3){
            return 'Advanced linear';
        }
        else if (level < 4){
            return 'Partially ExO';
        }
        else{
            return 'Fully ExO';
        }
}

// monkeypatching
Cocktail.patch(Backbone);

var objectToFormData = function(obj, form, namespace) {

  var fd = form || new FormData();
  var formKey;

  for(var property in obj) {
    if(obj.hasOwnProperty(property)) {

      if(namespace) {
        formKey = namespace + '[' + property + ']';
      } else {
        formKey = property;
      }

      // if the property is an object, but not a File,
      // use recursivity.
      if(typeof obj[property] === 'object' && !(obj[property] instanceof File)) {

        objectToFormData(obj[property], fd, property);

      } else {

        // if it's a string or a File object
        fd.append(formKey, obj[property]);
      }

    }
  }
  return fd;
};

String.prototype.replaceAll = function(target, replacement) {
  return this.split(target).join(replacement);
};


function same_height(selector){
    var heights = [];
    $(selector).each(function(index, element){
        heights.push($(element).parent().height());
    });
    var maximum = _.max(heights);
    $(selector).each(function(index, element){
        $(element).css('min-height', maximum);
    });
}

(function($) {
  var types = 'text search number email datetime datetime-local date month week time tel url color range'.split(' '),
      len = types.length;
  $.expr[':'].textall = function(elem) {
    var type = elem.getAttribute('type');
    for (var i = 0; i < len; i++) {
      if (type === types[i]) {
        return true;
      }
    }
    return false;
  };
})(jQuery);
