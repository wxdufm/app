import React from 'react'
import ArchiveBreadcrumbs from './ArchiveBreadcrumbs'

// imported into every page in "archive" pages directory
const ArchiveLayout = (props) => {
	return (
		<div className="mx-auto w-5/6 overflow-hidden pb-10 text-white">
			<ArchiveBreadcrumbs />

			{props.children}
		</div>
	)
}

export default ArchiveLayout
