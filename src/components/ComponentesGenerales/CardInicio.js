import { Link } from "react-router-dom";

const CardInicio = ({ data }) => {
  const { to, imgSrc, title, subtitle } = data;

  const content = (
    <>
      <img src={imgSrc} alt={title} />
      <div className="qf-card-footer">
        <h2 style={{ fontSize: "1.5rem", margin: "10px 0", textAlign: "center", color: "black" }}>
          {title}
        </h2>
        <p style={{ textAlign: "center", fontStyle: "italic", color: "black", fontSize: "1rem" }}>
          {subtitle}
        </p>
      </div>
    </>
  );

  if (to) {
    return <Link to={to}>{content}</Link>;
  }
  return <div>{content}</div>;
};

export default CardInicio;
