var InputfieldImagePicker = {
    init: function () {
        // console.log('init');
        var fields = document.querySelectorAll('.InputfieldImagePicker');
        fields.forEach(field => {
            if(field.classList.contains('initialised')) return;
            InputfieldImagePicker.initPickFile(field);
        });
    },
    initPickFile: function (field) {
        field.classList.add('initialised');
        var preview = field.querySelector('div.uk-panel img');
        var caption = field.querySelector('div.uk-panel .uk-thumbnail-caption');
        var remove = field.querySelector('div.uk-panel > span');
        var input = field.querySelector('input[type="hidden"]');
        var files = field.querySelectorAll('.uk-thumbnav img');

        remove.addEventListener('click', function(e) {
            preview.setAttribute('src', preview.getAttribute('data-src'));
            caption.innerHTML = '';
            input.value = '';
        });
        files.forEach(file => {
            file.addEventListener('click', function(e){
                var src = file.getAttribute('src');
                var filename = file.getAttribute('data-filename');
                preview.setAttribute('src', src);
                input.value = filename;
                caption.innerHTML = filename;
            })
        });
        
    }
}

document.addEventListener('DOMContentLoaded', InputfieldImagePicker.init);

$(document).on('reloaded', '.InputfieldRepeaterItem', InputfieldImagePicker.init);
