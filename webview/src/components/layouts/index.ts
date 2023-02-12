/** @format */

import { DerivateIcon } from '@/components/icons';
export type LayoutsPluginType = Record<string, unknown>;

const LayoutsPlugin: LayoutsPluginType = {
	Basic: {
		componentPlugins: {
		},
		defaultOpen: true,
		icons: {
			DerivateIcon,
		},
	},
};
export default LayoutsPlugin;
