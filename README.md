# FieldtypeImagePicker & InputfieldImagePicker

**Fieldtype Image Reference From Another Page** is a Fieldtype that stores a reference to a single image from another page. The image can be selected with the associated Inputfield.

**Inputfield Select Image From Page** is an Inputfield to select a single image from images on a predefined page and it's children.

![Inputfield in page edior](images/inputfield-in-editor.png)

### Settings

* The page containing the images to choose from.
    - images from that page and it's child pages will be used as site-wide images.
* The field name of the images field on that page.
* Option to include images from child pages of the page that contains images
* Option to load thumbnails on demand via ajax. Especially useful when field is used inside repeaters or has many images
* Width of chosen image in Inputfield.
* Width of image thumbnails in Inputfield.

![Inputfield Settings](images/field-settings.png)

All settings are per field that you create from this fieldtype. This means you can have different images to choose from for different fields that you create.

### When to use ?

Let editors choose an image from a set of images that is being used site-wide. Ideal for images that are being re-used across the site.
Suited for images that are used on multiple pages throughout the site (e.g. icons). 
Other than the native ProcessWire images field, the images here are not stored per page. Only references to images on another page are stored. This has several advantages:
* one central place to organize images
* when images change, you only have to update them in one place. All references will be updated, too. (Provided the name of the image that has changed stays the same)

### Features

* Images can be organized into categories. Child pages of the main 'image holder page' serve as categories
* Images can be manipulated like native ProcessWire images (resizing, cropping etc.)
* Image names are fully searchable through the API
```php
$pages->find('fieldname.filename=xyz.png');
$pages->find('fieldname.filename%=xy.png');
```
* Accidental image deletion is prevented. When you want to delete an image from one of the pages that hold your site-wide images, the module searches all pages that use that image. If any page contains a reference to the image you are trying to delete, deletion will be prevented. You will get an error message to help you edit those pages and remove references there before you can finally delete the image.
* Image thumbnails loaded into inputfield on demand


### How to install and setup
1. Download and install this module like any other modules in ProcessWire
2. Create a page in the page tree that will hold your images and supply them to the inputfield. This page's template must have an images field
3. Upload some images to the page you created in step 2
4. Create a new field. As type choose 'Image Reference From Another Page'. Save the field.
5. In 'Details' Tab of the field choose the page you created in step 2
6. Click Save button
7. Choose the images field name for the field that holds your images (on page template from step 2)
8. Click Save button again
9. Choose whether you want to include child pages of page from step 2 to supply images
10. Add the field to any template
11. You are now ready to use the field

### How to use in template files

```php
// render image 
<img src="<?= $page->fieldname->url ?>"> 
// all native ProcessWIre image manipulation methods (resizing, cropping etc.) are available
$thumb = $page->fieldname->width(100);
// render the text content for inlining SVG (works only with SVG images)
$page->fieldname->svgcontent
// search for image by file name
$pages->find('fieldname.filename=xyz.png');
```

[ProcessWire forum thread](https://processwire.com/talk/topic/22732-fieldtypeimagepicker-pick-an-image-from-predefined-pages/)

### Credits
This module was developed based on ideas from forum members in [this forum thread](https://processwire.com/talk/topic/22665-module-fieldtypeimagepicker-pick-images-from-a-folder/)
