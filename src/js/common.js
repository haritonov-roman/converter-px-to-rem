'use strict'

document.addEventListener("DOMContentLoaded", () => {

// CONSTANTS
const app = document.querySelector(".main");
const settings_panel = app.querySelector(".settings-panel");

// fields
const all_fields = app.querySelectorAll('.field');
const base_field = app.querySelector(".line-field__input_base");
const input_field = app.querySelector(".area-field__textarea_input");
const output_field = app.querySelector(".area-field__textarea_output");

// massage
const massages = app.querySelectorAll("[data-hint]");
const msg = document.querySelector(".msg");
const msg_txt = msg.querySelector(".msg__txt");
const hint = document.querySelector(".hint");

// checkbox
const checkbox_operation = app.querySelector(".checkbox__input_operation");

// buttons
const btn_action = app.querySelector(".btn_round_action");
const btn_clear_input = app.querySelector(".btn_square_clear");
const btn_copy_output = app.querySelector(".btn_square_copy");
const btn_settings = app.querySelector(".btn_square_settings");



// VARS
let regExp = /\d*\.?\d+px/gi;
let convertTo = 'rem';



// INSTRUCTIONS
for(let field of all_fields) {
    field.value = sessionStorage.getItem(field.name);
};



// LISTENERS

// hint
document.addEventListener('mousemove', function(e) {
    hint.style.left = e.pageX + "px";
    hint.style.top = e.pageY + "px";
});

for(let item of massages) {

    item.addEventListener('mouseover', function(e) {
        hint.innerHTML = this.dataset.hint + "";
        hint.classList.add('is-active');
    });
    
    item.addEventListener('mouseout', function(e) {
        hint.classList.remove('is-active');
    });

};

// buttons
btn_action.addEventListener('click', action);
btn_clear_input.addEventListener('click', clear);
btn_copy_output.addEventListener('click', copy);
btn_settings.addEventListener('click', function(e) {
    e.preventDefault();

    if(base_field.value != '') {
        settings_panel.classList.toggle("is-active");
    } else {
        pushMsg("Введите значение в поле BASE", "alert");
    };

});

// checkbox
checkbox_operation.addEventListener("click", changeOption);

// fields
for(let field of all_fields) {
    field.addEventListener("change", function(e) {
        changeInput(e.target);
    });
};



// FUNCTIONS
function pushMsg(text, type) {
    msg.classList.remove('is-active');

    msg_txt.innerHTML = text;

    if(type == "info") {
        msg.classList.remove('msg_alert');
        msg.classList.add('msg_info');
    } else {
        msg.classList.remove('msg_info');
        msg.classList.add('msg_alert');
    }

    msg.classList.add('is-active');
    
    setTimeout(function(e) {
        msg.classList.remove('is-active');
    }, 5000);
}

function changeInput(elem) {
    sessionStorage.setItem(elem.name, elem.value);
};

function changeOption() {
    if(checkbox_operation.checked == true) {
        regExp = /\d*\.?\d+rem/gi;
        convertTo = 'px';
    } else {
        regExp = /\d*\.?\d+px/gi;
        convertTo = 'rem';
    };
};

function clear() {
    for(let field of all_fields) {
        field.value = "";
    };

    sessionStorage.clear();

    pushMsg("Все поля ввода очищены", "info");
};

function copy() {
    output_field.select();
    document.execCommand('copy');

    window.getSelection().removeAllRanges();

    pushMsg("Результат скопирован в буфер", "info");
};

function action() {
    let base = parseFloat(getData(base_field));
    let data = getData(input_field);

    if(!isNaN(base)) {

        if(regExp.test(data)) { 

            let arr = null;

            if(checkbox_operation.checked == true) {
                arr = data.replace(regExp, match => {
                    return convertRemToPx(match, base);
                });
                console.log(true)
            } else {
                arr = data.replace(regExp, match => {
                    return convertPxToRem(match, base);
                });
                console.log(false)
            };
            
            giveData(output_field, arr);

            sessionStorage.setItem("output", arr);

            pushMsg("CSS преобразован", "info");

        } else if(convertTo == 'rem') {
            pushMsg('В CSS не найдено значений в "px"', "alert");
        } else if(convertTo == 'px') {
            pushMsg('В CSS не найдено значений в "rem"', "alert");
        };

    } else {
        pushMsg("Введенное значение BASE не соответствует числу", "alert");
    };

};

function convertPxToRem(item, base) {
    return (parseFloat(item) / base).toFixed(1) + 'rem';
}

function convertRemToPx(item, base) {
    return (parseFloat(item) * base).toFixed(1) + 'px';
}

function getData(field) {
    return field.value;
};

function giveData(field, data) {
    field.value = data;
};

});