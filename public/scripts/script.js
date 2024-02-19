const input = document.querySelector("#discord-username");

if (input) {
  const maskedInputController = vanillaTextMask.maskInput({
    inputElement: input,
    guide: false,
    mask: function (value, params) {
      const index = value.indexOf("#");

      let result = new Array(index !== -1 ? index : value.length).fill(/[^#]/);

      if (index !== -1) {
        result.push("#");

        if (value.length - index - 1 > 0) {
          result = result.concat(
            new Array(value.length - index - 1).fill(/\d/)
          );
        }
      }

      return result;
    },
  });
}

const rgpdCheckbox = document.querySelector("#checkRGPD");
const submitButton = document.querySelector("#submit-button");

if (rgpdCheckbox && submitButton) {
  const handleUpdate = () => {
    if (rgpdCheckbox && submitButton) {
      if (rgpdCheckbox.checked) {
        submitButton.removeAttribute("disabled");
      } else {
        submitButton.setAttribute("disabled", "true");
      }
    }
  };

  rgpdCheckbox.addEventListener("change", handleUpdate, false);

  handleUpdate();
}
