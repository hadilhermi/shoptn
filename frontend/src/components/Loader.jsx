export default function Loader({ text = "Chargement..." }) {
  return (
    <div className="status">
      <div className="spinner"></div>
      <p>{text}</p>
    </div>
  );
}