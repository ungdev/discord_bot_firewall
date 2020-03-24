var input = document.querySelector('#discord-username');

if (input) {
  var maskedInputController = vanillaTextMask.maskInput({
    inputElement: input,
    guide: false,
    mask: function(value, params) {
      var index = value.indexOf('#');

      var result = new Array(index !== -1 ? index : value.length).fill(/[^#]/);

      if (index !== -1) {
        result.push('#');

        if (value.length - index - 1 > 0) {
          result = result.concat(
            new Array(value.length - index - 1).fill(/\d/)
          );
        }
      }

      return result;
    }
  });
}

var rgpdCheckbox = document.querySelector('#checkRGPD');
var submitButton = document.querySelector('#submit-button');

if (rgpdCheckbox && submitButton) {
  var handleUpdate = () => {
    if (rgpdCheckbox && submitButton) {
      if (rgpdCheckbox.checked) {
        submitButton.removeAttribute('disabled');
      } else {
        submitButton.setAttribute('disabled', 'true');
      }
    }
  };

  rgpdCheckbox.addEventListener('change', handleUpdate, false);

  handleUpdate();
}
