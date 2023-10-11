import useWindowSize from "./useWindowSize";

export default function useIsMobile(width = 700) {
    const windowSize = useWindowSize();

    return windowSize.width <= width;
}