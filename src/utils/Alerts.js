
function destroyPopup(popup) {
    popup.classList.remove('open');
    popup.remove();
}

function init(promise, options) {

    const popup = document.createElement('form');
    popup.classList.add('modal-dialog');

  
    popup.insertAdjacentHTML('afterbegin',
    `<div class="modal-content">
        <div class="modal-header">
            ${options.title}
        </div>
        <div class="modal-body">
            <label>${options.message}</label>
            <input type="text" name="input" class="prompt" value="${options.default || ""}" />
        </div>
        <div class="modal-footer">
            <input type="button" class="btn btn-cancel" value="Cancel" />
            <input type="submit" class="btn" value="OK" />
        </div>
    </div>`);


    let input = popup.querySelector("input[type=text]")

    // remove if not need input
    if (!options.input) {
        input.remove();
    }
    
    // remove cancel if not need 
    let skipButton = popup.querySelector(".btn-cancel")
    if (!options.cancel) {
        skipButton.remove();
    }else{
        skipButton.addEventListener('click', () => {
            promise.resolve(null);
            destroyPopup(popup);
        },{ once: true });
    }

    // listen for the submit event on the inputs
    popup.addEventListener("submit", function (e) {
        e.preventDefault();

        if (!options.input) {
            promise.resolve(true);
        }else{
            promise.resolve(e.target.input.value);
        }

        destroyPopup(popup);
    }, { once: true });

    document.body.appendChild(popup);
    popup.classList.add('open');

};

function extend (objDefaults, obj2) { 
    var result = objDefaults, val;
    for (val in obj2) {
        if (obj2.hasOwnProperty(val) && typeof obj2[val] != "undefined") {
            result[val] = obj2[val];
        }
    }
    return result;
}

export default {

    prompt( message, defaultValue, title ) {

        const options = { message, default : defaultValue , title};
        
        const defaults = {title: "Prompt", message: null, default: null, cancel : true, input : true};
        
        return new Promise((resolve, reject) => init({ resolve, reject }, extend( defaults, options)));
    },
    
    // Usage: const file = await prompt({title: "Nome do Arquivo", default: "./DEMO.md", cancel : true});
    confirm(message, title) {

        const options = { message, title};

        const defaults = {title: "Confirmação", message: null, default: null, cancel : true, input : false};

        return new Promise((resolve, reject) => init({ resolve, reject }, extend( defaults, options)));
    }


}