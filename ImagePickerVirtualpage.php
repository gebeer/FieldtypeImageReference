<?php

namespace ProcessWire;

class ImagePickerVirtualpage extends Page
{
    protected $path;
    protected $template;
    public $virtualImages;
    /**
     * Instance of PagefilesManager, which manages and migrates file versions for this page
     *
     * Only instantiated upon request, so access only from filesManager() method in Page class. 
     * Outside API can use $page->filesManager.
     * 
     * @var PagefilesManager|null
     *
     */
    private $filesManager = null;

    public function __construct($path)
    {
        $this->path = $path;
        $this->initPage();
        parent::__construct();
    }
    
    protected function initPage()
    {
        $fieldgroup = new Fieldgroup;
        $imgField = $this->wire('fields')->get("type=FieldtypeImage, maxFiles!=1");
        if ($imgField) $fieldgroup->add($imgField);
        $fieldgroup->add($this->wire('fields')->get('title'));
        $template = new Template;
        $template->name = 'imagepickervirtualtemplate';
        $template->setFieldgroup($fieldgroup);
        $this->set('template', $template);
        // $this->set('title', "Images in folder {$this->url()}");
        $this->set('name', 'imagepickervirtualpage');
        $this->set('id', 0);
        $this->populateImages($imgField->name);
        $this->virtualImages = $this->get($imgField->name);
    }
    
    protected function populateImages($imagefield)
    {
        // add all files in folder
        foreach($this->filesManager()->getFiles() as $file) {
            $pageimage = new Pageimage($this->$imagefield, $this->path . $file);
            // skip if image is a variation 
            $variation = $pageimage->isVariation($file, array('allowSelf' => true));
            if($variation) continue;
            $this->$imagefield->add($this->path . $file);
        }
        // remove variations
        // foreach($this->$imagefield->getAllVariations() as $variations) {
        //     if(empty($variations)) continue;
        //     foreach($variations as $filename) {
        //         $this->$imagefield->remove($filename);
        //     }
        // }
    }

    /**
     * Provides the hookable implementation for the path() method.
     *
     * The method we're using here by having a real path() function above is slightly quicker than just letting 
     * PW's hook handler handle it all. We're taking this approach since path() is a function that can feasibly
     * be called hundreds or thousands of times in a request, so we want it as optimized as possible.
     * 
     * #pw-internal
     *
     */
    public function path()
    {
        return $this->path;
    }
    /**
     * Returns the web accessible index URL where files are stored
     * 
     * @return string
     *
     */
    public function url($options = NULL)
    {
        return substr($this->path, strpos($this->path, '/site'));
    }

    /**
     * Return instance of PagefilesManager specific to this Page
     * 
     * #pw-group-advanced
     *
     * @return PagefilesManager
     *
     */
    public function filesManager()
    {
        if (is_null($this->filesManager)) $this->filesManager = $this->wire(new VirtualpageFilesManager($this));
        return $this->filesManager;
    }
}

class VirtualpageFilesManager extends PagefilesManager
{
    protected $path;

    public function __construct($page)
    {
        parent::__construct($page);
    }

    /**
     * Get the published path for files
     * 
     * #pw-hooks
     * 
     * @return string
     * @throws WireException if attempting to access this on a Page that doesn't yet exist in the database
     *
     */
    public function path()
    {
        return self::_path($this->page);
    }

    /**
     * Get the published URL for files
     * 
     * #pw-hooks
     * 
     * @return string
     * @throws WireException if attempting to access this on a Page that doesn't yet exist in the database
     *
     */
    public function url()
    {
        $path = $this->path();
        return substr($path, strpos($path, '/site'));
    }

    /**
     * Get the files path for a given page (whether it exists or not).
     * 
     * #pw-group-static
     *
     * @param Page $page
     * @param bool $extended Whether to force use of extended paths, primarily for recursive use by this function only.
     * @return string 
     *
     */
    static public function _path(Page $page, $extended = false)
    {
        return $page->path;
    }
}
