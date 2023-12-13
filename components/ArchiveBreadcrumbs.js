import Crumb from './SingleCrumb'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import {useRouter} from 'next/router'
import React from 'react'
import {IoIosArrowForward} from 'react-icons/io'

export default function ArchiveBreadcrumbs() {
	// get current route details
	const router = useRouter()

	const breadcrumbs = React.useMemo(
		function generateBreadcrumbs() {
			const asPathNestedRoutes = router.asPath
				.split('/')
				.filter((v) => v.length > 0)

			// remove "archive" from breadcrumbs to not interfere w/ styled title on main page
			if (asPathNestedRoutes[0] === 'archive') {
				asPathNestedRoutes.shift()
			}

			const crumblist = asPathNestedRoutes.map((subpath, idx) => {
				// put archive back in the route so everything links correctly
				const href =
					'/archive/' + asPathNestedRoutes.slice(0, idx + 1).join('/')

				// format crumb labels
				const words = subpath.split('-')
				const transformedWords = words.map(
					(word) => word.charAt(0).toUpperCase() + word.slice(1)
				)
				const title = transformedWords.join(' ')

				return {href: href, text: title}
			})

			// put archive breadrumb back on non-index archive pages
			return [{href: '/archive', text: 'Archive'}, ...crumblist]
		},
		[[router.asPath]]
	) // re-run every time route changes

	return (
		<Breadcrumbs
			aria-label="breadcrumb"
			separator={<IoIosArrowForward size={18} className="ml-1 mt-0.5" />}
			color="white"
		>
			{breadcrumbs.map((crumb, idx) => (
				<Crumb {...crumb} key={idx} last={idx === breadcrumbs.length - 1} />
			))}
		</Breadcrumbs>
	)
}
