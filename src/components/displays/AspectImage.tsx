import React, {
	type CSSProperties,
	type ImgHTMLAttributes,
	type ReactNode,
	type Ref,
	type SyntheticEvent,
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
} from 'react';
import { useDeferredSrc } from '../../utils/imageLoadDelay';
import '../../styles/aspect-image.css';

export type AspectRatioValue = string | number | readonly [number, number];

export function cssAspectRatio(value: AspectRatioValue): string {
	if (typeof value === 'number') return String(value);
	if (typeof value === 'string') return value;
	return `${value[0]} / ${value[1]}`;
}

export function ratioFromAspect(value: AspectRatioValue): number {
	if (typeof value === 'number') return value;
	if (typeof value === 'string') {
		const parts = value.split('/').map((part) => Number(part.trim()));
		if (parts.length === 2 && parts[0] && parts[1]) return parts[0] / parts[1];
		const asNumber = Number(value);
		return Number.isFinite(asNumber) && asNumber > 0 ? asNumber : 1;
	}
	return value[1] ? value[0] / value[1] : 1;
}

function assignRef<T>(ref: Ref<T> | undefined, value: T | null) {
	if (!ref) return;
	if (typeof ref === 'function') {
		ref(value);
		return;
	}
	(ref as { current: T | null }).current = value;
}

export type AspectImageProps = {
	src: string;
	alt: string;
	/** Reserves layout space before the image loads. Prefer this or width/height. */
	aspectRatio?: AspectRatioValue;
	width?: number;
	height?: number;
	/** Fill a parent that already owns the aspect box. */
	fill?: boolean;
	/** Prefer contain sizing (natural thumbs). Default is cover. */
	natural?: boolean;
	className?: string;
	imgClassName?: string;
	style?: CSSProperties;
	imgStyle?: CSSProperties;
	/** Ref to the underlying img element. */
	imgRef?: Ref<HTMLImageElement>;
	loading?: ImgHTMLAttributes<HTMLImageElement>['loading'];
	decoding?: ImgHTMLAttributes<HTMLImageElement>['decoding'];
	draggable?: boolean;
	'data-gallery-path'?: string;
	onLoad?: ImgHTMLAttributes<HTMLImageElement>['onLoad'];
	onError?: ImgHTMLAttributes<HTMLImageElement>['onError'];
	/** Called when intrinsic or reserved aspect is known. */
	onIntrinsicAspect?: (ratio: number) => void;
	children?: ReactNode;
};

function resolveReservedAspect({
	aspectRatio,
	width,
	height,
}: Pick<AspectImageProps, 'aspectRatio' | 'width' | 'height'>): AspectRatioValue | null {
	if (aspectRatio != null) return aspectRatio;
	if (width && height) return [width, height] as const;
	return null;
}

export default function AspectImage({
	src,
	alt,
	aspectRatio,
	width,
	height,
	fill = false,
	natural = false,
	className,
	imgClassName,
	style,
	imgStyle,
	imgRef: imgRefProp,
	loading = 'lazy',
	decoding = 'async',
	draggable = false,
	'data-gallery-path': dataGalleryPath,
	onLoad,
	onError,
	onIntrinsicAspect,
	children,
}: AspectImageProps) {
	const deferredSrc = useDeferredSrc(src);
	const imageRef = useRef<HTMLImageElement>(null);
	const [loaded, setLoaded] = useState(false);
	const reserved = resolveReservedAspect({ aspectRatio, width, height });
	const reservedRatio = reserved != null ? ratioFromAspect(reserved) : null;

	const setImageNode = (node: HTMLImageElement | null) => {
		imageRef.current = node;
		assignRef(imgRefProp, node);
	};

	useEffect(() => {
		setLoaded(false);
	}, [deferredSrc]);

	useLayoutEffect(() => {
		if (reservedRatio != null) {
			onIntrinsicAspect?.(reservedRatio);
		}
	}, [onIntrinsicAspect, reservedRatio]);

	useLayoutEffect(() => {
		const image = imageRef.current;
		if (!image || !deferredSrc) return;
		if (image.complete && image.naturalWidth > 0) {
			setLoaded(true);
			if (reservedRatio == null && image.naturalHeight) {
				onIntrinsicAspect?.(image.naturalWidth / image.naturalHeight);
			}
		}
	}, [deferredSrc, onIntrinsicAspect, reservedRatio]);

	const handleLoad = (event: SyntheticEvent<HTMLImageElement>) => {
		const image = event.currentTarget;
		setLoaded(true);
		if (reservedRatio == null && image.naturalWidth && image.naturalHeight) {
			onIntrinsicAspect?.(image.naturalWidth / image.naturalHeight);
		}
		onLoad?.(event);
	};

	const handleError = (event: SyntheticEvent<HTMLImageElement>) => {
		setLoaded(true);
		onError?.(event);
	};

	const rootClassName = [
		'aspect-image',
		fill ? 'aspect-image--fill' : '',
		natural ? 'aspect-image--natural' : '',
		loaded ? 'is-loaded' : '',
		className,
	]
		.filter(Boolean)
		.join(' ');

	const rootStyle: CSSProperties = {
		...style,
		...(reserved != null && !fill ? { aspectRatio: cssAspectRatio(reserved) } : {}),
	};

	return (
		<span className={rootClassName} style={rootStyle}>
			<span className="aspect-image__skeleton" aria-hidden="true" />
			{deferredSrc ? (
				<img
					ref={setImageNode}
					className={['aspect-image__media', imgClassName].filter(Boolean).join(' ')}
					src={deferredSrc}
					alt={alt}
					width={width}
					height={height}
					loading={loading}
					decoding={decoding}
					draggable={draggable}
					data-gallery-path={dataGalleryPath}
					style={imgStyle}
					onLoad={handleLoad}
					onError={handleError}
				/>
			) : null}
			{children}
		</span>
	);
}
