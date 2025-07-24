import { useNavigate } from 'react-router-dom';
import './notFound.css';

function NotFound() {
  const navigate = useNavigate();
  const handleBack = () => navigate(-1);

  return (
    <div className="not-found">
      <h1>Error 404</h1>
      <h1>Page Not Found</h1>
      <button onClick={handleBack}>Go Back</button>
    </div>
  );
}

export default NotFound;