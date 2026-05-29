import classNames from "classnames";

export default function Img({ src, alt = "", float, width, fullBleed, noMaxHeight, eager, caption }) {
  const style = {};
  if (width && !fullBleed) style.maxWidth = `${width}%`;

  return (
    <figure
      className={classNames("Img", {
        "Img--float-left": float === "left",
        "Img--float-right": float === "right",
        "Img--full-bleed": fullBleed,
        "Img--no-max-height": noMaxHeight,
      })}
      style={Object.keys(style).length ? style : undefined}
    >
      <img src={src} alt={alt} loading={eager ? "eager" : "lazy"} className="Img__image" />
      {caption && <figcaption className="Img__caption">{caption}</figcaption>}
    </figure>
  );
}
