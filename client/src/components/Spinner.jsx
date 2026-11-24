const Spinner = ({ text = "Loading..." }) => (
  <div className="spinner-wrap">
    <div className="spinner" />
    <p className="muted">{text}</p>
  </div>
);

export default Spinner;