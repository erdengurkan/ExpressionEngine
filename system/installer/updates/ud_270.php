<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

/**
 * ExpressionEngine - by EllisLab
 *
 * @package		ExpressionEngine
 * @author		EllisLab Dev Team
 * @copyright	Copyright (c) 2003 - 2013, EllisLab, Inc.
 * @license		http://ellislab.com/expressionengine/user-guide/license.html
 * @link		http://ellislab.com
 * @since		Version 2.7.0
 * @filesource
 */
 
// ------------------------------------------------------------------------

/**
 * ExpressionEngine Update Class
 *
 * @package		ExpressionEngine
 * @subpackage	Core
 * @category	Core
 * @author		EllisLab Dev Team
 * @link		http://ellislab.com
 */
class Updater {
	
	var $version_suffix = '';
	
	/**
	 * Do Update
	 *
	 * @return TRUE
	 */
	public function do_update()
	{
		ee()->load->dbforge();

		$steps = new ProgressIterator(
			array(
				'_drop_pings',
				'_drop_updated_sites',
				'_update_localization_preferences'
			)
		);

		foreach ($steps as $k => $v)
		{
			$this->$v();
		}

		return TRUE;
	}

	// --------------------------------------------------------------------

	/**
	 * Drop ping data and columns
	 */
	private function _drop_pings()
	{
		ee()->dbforge->drop_table('entry_ping_status');
		ee()->dbforge->drop_table('ping_servers');

		ee()->smartforge->drop_column('channels', 'ping_return_url');

		ee()->load->library('layout');
		ee()->layout->delete_layout_fields('ping');
	}

	// --------------------------------------------------------------------

	/**
	 * Drop updated sites module data
	 */
	private function _drop_updated_sites()
	{
		$query = ee()->db
			->select('module_id')
			->get_where('modules', array('module_name' => 'Updated_sites'));

		if ($query->num_rows())
		{
			ee()->db->delete('module_member_groups', array('module_id' => $query->row('module_id')));
			ee()->db->delete('modules', array('module_name' => 'Updated_sites'));
			ee()->db->delete('actions', array('class' => 'Updated_sites'));

			ee()->dbforge->drop_table('updated_sites');
			ee()->dbforge->drop_table('updated_site_pings');			
		}

		return TRUE;
	}

	// --------------------------------------------------------------------

	/**
	 * Remove the default localization member in favor or a site setting
	 * under global localization prefs.
	 */
	private function _update_localization_preferences()
	{
		$query = ee()->db->query("SELECT * FROM exp_sites");

		foreach ($query->result_array() as $row)
		{
			$conf = $row['site_system_preferences'];
			$data = unserialize(base64_decode($conf));

			if (isset($data['server_timezone']))
			{
				if ( ! isset($data['default_site_timezone']) ||
					$data['default_site_timezone'] == '')
				{
					$data['default_site_timezone'] = $data['server_timezone'];
				}

				unset(
					$data['server_timezone'],
					$data['default_site_dst'],
					$data['honor_entry_dst']
				);
			}

			ee()->db->update(
				'sites',
				array('site_system_preferences' => base64_encode(serialize($data))),
				array('site_id' => $row['site_id'])
			);
		}

		ee()->smartforge->drop_column('members', 'localization_is_site_default');

		return TRUE;
	}
}	
/* END CLASS */

/* End of file ud_270.php */
/* Location: ./system/expressionengine/installer/updates/ud_270.php */