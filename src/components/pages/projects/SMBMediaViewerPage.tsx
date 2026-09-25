import ProjectPage, { GalleryItem, ProjectFilmstrip } from '../ProjectPage';
import { getProject } from '../../../data/projects';

const galleryStrip: GalleryItem[] = [
    {
        title: 'Desktop gallery',
        path: 'smb-media-viewer/desktop-gallery.png',
        description: 'The desktop version of the gallery view.',
    },
    {
        title: 'Mobile gallery',
        path: 'smb-media-viewer/mobile-gallery.jpg',
        description: 'The mobile version of the gallery view.',
    },
];

const mediaViewStrip: GalleryItem[] = [
    {
        title: 'Desktop media view',
        path: 'smb-media-viewer/desktop-image-view.png',
        description: 'The desktop version of the image view.',
    },
    {
        title: 'Mobile image view',
        path: 'smb-media-viewer/mobile-image-view.jpg',
        description: 'The mobile version of the image view.',
    },
	{
		title: 'Desktop video view',
		path: 'smb-media-viewer/desktop-video-view.png',
		description: 'The desktop version of the video view.',
	},
	{
		title: 'Mobile video view',
		path: 'smb-media-viewer/mobile-video-view.jpg',
		description: 'The mobile version of the video view.',
	},
];

const fileViewStrip: GalleryItem[] = [
	{
		title: 'Documents folder',
		path: 'smb-media-viewer/documents-folder.png',
		description: 'An example of a documents folder with various file types.',
	},
	{
		title: 'Audio player',
		path: 'smb-media-viewer/mp3-player.png',
		description: 'An example of the audio player for an MP3 file.',
	},
	{
		title: 'PDF view',
		path: 'smb-media-viewer/pdf-viewer.png',
		description: 'An example of the viewer for a PDF file.',
	},
	{
		title: 'Spreadsheet view',
		path: 'smb-media-viewer/spreadsheet-viewer.png',
		description: 'An example of the viewer for a spreadsheet file.',
	},
	{
		title: 'Source code view',
		path: 'smb-media-viewer/python-viewer.png',
		description: 'An example of the view for a source code file.',
	},
];

const castStrip: GalleryItem[] = [
    {
        title: 'Cast modal',
        path: 'smb-media-viewer/cast-modal.png',
        description: 'The cast modal allows users to cast media to any device that supports Google Cast.',
    },
	{
		title: 'Cast controls',
		path: 'smb-media-viewer/cast-controls.png',
		description: 'The cast controls allow users to control the casted media.',
	},
];

const adminStrip: GalleryItem[] = [
    {
        title: 'Admin cache table',
        path: 'smb-media-viewer/admin-cache.png',
        description: 'The admin cache view allows administrators to view and manage cached media files.',
    },
	{
		title: 'Admin index table',
		path: 'smb-media-viewer/admin-index.png',
		description: 'The admin index view allows administrators to view and manage indexed media files.',
	},
];

export default function SMBMediaViewerPage() {
	const project = getProject('smb-media-viewer');

	return (
		<ProjectPage
			projectId={project.id}
			project={{
				name: project.name,
				title: project.title,
				description: (
					<>
					<h2>Overview</h2>
					<p>
						SMB Media Viewer is a self-hosted browser-based media viewer for Samba shares. It is specifically designed to be a lightweight
						alternative to other popular open source gallery apps, such as Immich. With support for 150+ file types, it is a versatile
						tool for not only browsing photos and videos, but also for viewing documents, source code, and more, without having to change
						the way files are stored on the server.
					</p>

					<h2>Gallery</h2>

					<h3>Folder Grid Structure</h3>
					<p>
						Users are presented with a simple but elegant gallery-style view of their media. Images and videos are automatically indexed
						to enable date sorting, and thumbnails are generated for each file to provide a quick preview.
					</p>
					<ProjectFilmstrip media={galleryStrip} aspectRatio="natural" flex="auto" />

					<h3>Image and Video Views</h3>
					<p>
						Images and videos are displayed in a fullscreen view.
						On desktop, users can navigate through the media using the left and right arrow keys, or by clicking on the previous and next
						buttons. On mobile, users can swipe left and right to navigate through the media.
						Users can also select their desired media quality, depending on their connection speed and data usage preferences.
						Different qualities will automatically be processed on the server on the fly and cached for future use.
					</p>
					<ProjectFilmstrip media={mediaViewStrip} aspectRatio="natural" flex="auto" maxPerRow={2} />

					<h3>Casting</h3>
					<p>
						Images and videos can be cast to any device that supports Google Cast. This allows users to easily share their media with others
						via a casted slideshow.
					</p>
					<ProjectFilmstrip media={castStrip} aspectRatio="natural" maxPerRow={1} />

					<h3>Other Supported File Types</h3>
					<p>
						Many other file types are supported, such as documents, source code, audio files, and more.
						Each file type is displayed in a viewer that is tailored for that specific file type.
						For example, PDF files are displayed in a viewer that is designed specifically to easily view PDF files.
						Documents are also displayed in the PDF viewer after being converted and cached.
					</p>
					<ProjectFilmstrip media={fileViewStrip} aspectRatio="natural" flex="auto" maxPerRow={2} />

					<h2>Users</h2>

					<h3>Accounts</h3>
					<p>
						Accounts are not managed by this app; they are managed by a pre-existing Samba configuration.
						Simply tell the app where to find the configuration file, and it will automatically use it to compare against credentials
						given during login.
					</p>

					<h3>Permissions</h3>
					<p>
						Users have the exact same viewing permissions as if they were accessing the shares directly via Samba. This app ensures that
						users can only view shares and files that they have permission to read. Users cannot modify files or directories via this app.
					</p>

					<h3>Administration</h3>
					<p>
						Administrators can be set via an environment variable during setup. Administrators can view and manage cached and indexed
						media files, cast sessions, job queues, and more. They are also able to easily view the app's storage usage, logs, etc.
					</p>
					<ProjectFilmstrip media={adminStrip} aspectRatio="natural" flex="auto" />
					</>
				),
			}}
			overview={{
				boxes: [
					{
						title: 'Extensive file support',
						icon: 'file',
						description: `Supports type-specific views for 150+ file types, including images, videos, audio files, documents, source code,
							and more.`,
					},
					{
						title: 'Non-intrusive media viewing',
						icon: 'file-image-o',
						description: `Users have full control over file storage; this app provides a mean of easily accessing and viewing media files
							from any device.`
					},
					{
						title: 'Gallery-style browsing',
						icon: 'picture-o',
						description: `Browse images and videos in a gallery-style view, with automatic thumbnail generation, fullscreen viewing,
							casting abilities, and more.`
					},
				],
			}}
			technologies={project.technologies}
			gallery={[...galleryStrip, ...mediaViewStrip, ...castStrip, ...fileViewStrip, ...adminStrip]}
		/>
	);
}
