<?php

namespace ProcessWire;
class ImagePicker extends WireData
{
	public function __construct() {
		$this->set('filename', ''); 
        $this->set('pageid', 0); 
        $this->set('value', 0); 
	}

    public function set($key, $value)
    {
        if ($key == 'filename') {
            $value = wire('sanitizer')->filename($value);
        } else if ($key == 'pageid') {
            $value = (int) $value;
        } else if ($key == 'value') {
            $value = wire('sanitizer')->text($value);
        }
        return parent::set($key, $value);
    }

    /**
     * If accessed as a string, then just output as a JSON string
     *
     */
    public function __toString()
    {
        return json_encode(array('pageid' => $this->pageid, 'filename' => $this->filename, 'value' => $this->value));
    }

}
