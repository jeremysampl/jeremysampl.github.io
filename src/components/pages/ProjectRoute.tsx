import React from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { projectHref, resolveProjectFromSlug } from '../../data/projects';
import { projectPages } from './projects/registry';

/** Resolves /projects/:slug from project data (with legacy redirects). */
export default function ProjectRoute() {
	const { slug } = useParams<{ slug: string }>();
	const resolved = slug ? resolveProjectFromSlug(slug) : undefined;

	if (!resolved) {
		return <Navigate to="/" replace />;
	}

	if (resolved.isLegacy) {
		return <Navigate to={projectHref(resolved.project.id)} replace />;
	}

	const Page = projectPages[resolved.project.id];
	return <Page />;
}
