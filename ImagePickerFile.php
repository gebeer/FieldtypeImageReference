<?php namespace ProcessWire;

/**
 * Class ImagePickerFile 
 * 
 * Holds information about an image file
 */

class ImagePickerFile extends \stdClass {

	/**
	 * Full file path on disk
	 * 
	 * @var string
	 * 
	 */
	public $path = '';

	/**
	 * File URL
	 * 
	 * @var string
	 * 
	 */
	public $url = '';

	/**
	 * File content only for svg
	 * 
	 * @var string|null
	 * 
	 */
	public $content;

	/**
	 * @param string $key
	 * @return mixed
	 * 
	 */
	public function get($key) {
		return $this->$key;
	}
		
}