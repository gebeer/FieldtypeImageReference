<?php namespace ProcessWire;

/**
 * Class IconFile 
 * 
 * Holds information about an icon file
 */

class IconFile extends \stdClass {

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