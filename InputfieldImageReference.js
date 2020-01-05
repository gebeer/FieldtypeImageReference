var InputfieldImageReference = {
    init: function () {
        var fields = document.querySelectorAll('.InputfieldImageReference');
        fields.forEach(field => {
            if (field.classList.contains('imagereference_initialised')) return;
            InputfieldImageReference.initPickFile(field);
        });
        InputfieldImageReference.initModalEditImages();
    },
    initPickFile: function (field) {
        if (!field.classList.contains('imagereference_initialised')) field.classList.add('imagereference_initialised');
        InputfieldImageReference.initGetThumbnails(field);
        InputfieldImageReference.initSelectAnyPage(field);
        InputfieldImageReference.initUploadImagesFolder(field);
        var preview = field.querySelector('div.uk-panel img');
        var caption = field.querySelector('div.uk-panel .uk-thumbnail-caption');
        var remove = field.querySelector('div.uk-panel > span');
        var inputValue = field.querySelector('input.imagereference_value');

        remove.addEventListener('click', function (e) {
            preview.setAttribute('src', preview.getAttribute('data-src'));
            caption.innerHTML = '';
            inputValue.value = '';
        });
        $(field).on('click', '.uk-thumbnav img', function (e) {
            var file = this;
            var src = file.getAttribute('src');
            var fileinfo = file.getAttribute('data-title');
            var filename = file.getAttribute('data-filename');
            var pageid = file.getAttribute('data-pageid');
            preview.setAttribute('src', src);
            inputValue.value = JSON.stringify({ "pageid": pageid.toString(), "filename": filename });
            caption.innerHTML = fileinfo;
        });
    },
    initGetThumbnails: function (field) {
        $(field).on('click', '.imagereference_thumbholder', function (e) {
            if (e.target.closest('.uk-thumbnav')) return;
            var target = e.currentTarget;
            var thumbnav = target.querySelector('.uk-thumbnav');
            var pageid = thumbnav.getAttribute('data-pageid');
            var folderpath = thumbnav.getAttribute('data-folderpath');
            var config = InputfieldImageReference.getFieldconfig(field);
            var url = InputfieldImageReference.buildUrl(config, pageid, folderpath);
            var closed = target.classList.contains('InputfieldStateCollapsed');
            var empty = thumbnav.querySelector('li') === null;
            if (closed && empty) {
                InputfieldImageReference.fetchAndInsertThumbnails(url, thumbnav);
            }
        });

    },
    fetchAndInsertThumbnails: function (url, thumbnav) {
        thumbnav.innerHTML = '<div uk-spinner></div>';
        xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    thumbnav.innerHTML = xhr.responseText;
                } else {
                    console.log('There was a problem with the request.');
                }
            }

        };
        xhr.open('GET', url);
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.send();
    },
    initModalEditImages: function () {
        $(document).on("pw-modal-closed", function (event, ui) {
            if ($(event.target).hasClass('imagereference_editimages')) {
                var link = $(event.target);
                var field = link.closest('.InputfieldImageReference')[0];
                var thumbnav = link.siblings('.uk-thumbnav')[0];
                var pageid = thumbnav.getAttribute('data-pageid');
                var config = InputfieldImageReference.getFieldconfig(field);
                var url = InputfieldImageReference.buildUrl(config, pageid, null);
                InputfieldImageReference.fetchAndInsertThumbnails(url, thumbnav, field);
            }
        });
    },
    initUploadImagesFolder: function (field) {
        if (!field.querySelector(".imagereference_editimages_folder")) return;
        $(field).on("click", '.imagereference_editimages_folder', function (event) {
            var target = event.target;
            if (!target.classList.contains('imagereference_editimages_folder')) {
                target = event.currentTarget;
            }
            event.preventDefault();
            var link = $(target);
            var thumbnav = link.siblings('.uk-thumbnav')[0];
            var folderpath = thumbnav.getAttribute('data-folderpath');
            var pageid = thumbnav.getAttribute('data-pageid');
            var uppyContainer = field.querySelector('.uppy');
            var extensions = uppyContainer.getAttribute('data-allowed');
            var maxsize = uppyContainer.getAttribute('data-maxsize');
            var config = InputfieldImageReference.getFieldconfig(field);
            var postUrl = config.url;
            var getUrl = InputfieldImageReference.buildUrl(config, pageid, folderpath);
            var tokenName = 'X-' + config.csrf.name;
            // var fieldName = field.querySelector('input.imagereference_value').getAttribute('name');
            var headers = {};
            headers['X-Requested-With'] = 'XMLHttpRequest';
            headers[tokenName] = config.csrf.value;
            // headers['HTTP_X_FIELDNAME'] = fieldName;
            var uppy = Uppy.Core({
                debug: false,
                autoProceed: false,
                restrictions: {
                    maxFileSize: config.maxFileSize,
                    allowedFileTypes: config.allowedFileTypes
                },
                meta: {
                    folderpath: folderpath
                }
            });
            uppy
                .use(Uppy.Dashboard, {
                    trigger: target,
                    inline: false,
                    target: uppyContainer,
                    replaceTargetContent: true,
                    showProgressDetails: true,
                    height: 470,
                    closeAfterFinish: true,
                    note: 'Max file size: ' + maxsize + ', Allowed extensions: ' + extensions,
                    /* metaFields: [
                        { id: 'name', name: 'Name', placeholder: 'file name' }
                    ], */
                    browserBackButtonClose: true
                })
                .use(Uppy.Xhr, {
                    endpoint: postUrl,
                    method: 'post',
                    formData: true,
                    fieldName: 'uppyfiles[]',
                    metaFields: ['name', 'folderpath'],
                    headers: headers
                })
                .on('complete', result => {
                    // console.log('successful files:', result.successful)
                    // console.log('failed files:', result.failed)
                    InputfieldImageReference.fetchAndInsertThumbnails(getUrl, thumbnav, field)
                });
            uppy.getPlugin('Dashboard').openModal();

        });
    },
    initSelectAnyPage: function (field) {
        var inputAnypage = field.querySelector(".imagereference_anypage");
        if (!inputAnypage) return;
        var wrapAnypage = inputAnypage.closest('.InputfieldPageListSelect');
        var thumbsField = wrapAnypage.nextSibling;
        var thumbnav = thumbsField.querySelector('.uk-thumbnav');
        var thumbholderLabel = wrapAnypage.nextSibling.querySelector('.imagereference_anypage_pagename');
        $(inputAnypage).on("pageSelected", function (event, data) {
            var pageid = data.id;
            if (pageid === 0) { // page was unselected
                thumbsField.classList.remove('in');
                return;
            }
            var config = InputfieldImageReference.getFieldconfig(field);
            var url = InputfieldImageReference.buildUrl(config, pageid, null);
            var selectedTitle = wrapAnypage.querySelector('.PageListSelectName');
            InputfieldImageReference.fetchAndInsertThumbnails(url, thumbnav);
            thumbholderLabel.innerHTML = selectedTitle.innerHTML;
            thumbsField.classList.add('in');
        });

        $(wrapAnypage).on("click", function (event) {
            if (thumbholderLabel.innerHTML) { // current image was chosen from any page
                thumbsField.classList.toggle('in');
            }
        });


    },
    getFieldconfig: function (field) {
        return config = ProcessWire.config.InputfieldImageReference[field.querySelector('input').getAttribute('data-fieldname')];
    },
    buildUrl: function (config, pageid, folderpath) {
        var imagesfields = config.imagesfields;
        var url = config.url + '&pageid=' + pageid;
        if (imagesfields.length && !folderpath) {
            for (let index = 0; index < imagesfields.length; index++) {
                url += '&imagesfields[' + index + ']=' + imagesfields[index];
            }
        }
        if (folderpath) url += '&folderpath=' + folderpath;
        return url;
    }
}

document.addEventListener('DOMContentLoaded', InputfieldImageReference.init);

$(document).on('reloaded', '.InputfieldRepeaterItem', InputfieldImageReference.init);
