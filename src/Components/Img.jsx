import classNames from "classnames";
import { useResponsiveImage } from "../utils/useResponsiveImage";

export default function Img({ src, alt = "", float, width, fullBleed, noMaxHeight, eager, caption }) {
  const style = {};
  if (width && !fullBleed) style.maxWidth = `${width}%`;

  const { containerRef, imgRef } = useResponsiveImage(src, eager);

  return (
    <figure
      ref={containerRef}
      className={classNames("Img", {
        "Img--float-left": float === "left",
        "Img--float-right": float === "right",
        "Img--full-bleed": fullBleed,
        "Img--no-max-height": noMaxHeight,
      })}
      style={Object.keys(style).length ? style : undefined}
    >
      <img ref={imgRef} alt={alt} className="Img__image" />
      {caption && <figcaption className="Img__caption">{caption}</figcaption>}
    </figure>
  );
}
