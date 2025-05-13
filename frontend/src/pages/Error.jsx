import { Link, useNavigate, useRouteError } from "react-router-dom"

// icons
import { HomeIcon, ArrowUturnLeftIcon } from "@heroicons/react/24/solid";

const Error = () => {
  const error = useRouteError();
  const navigate = useNavigate();

  return (
    <div className="error">
      <h1>Seems like there was a problem!</h1>
      <p>{error.message || error.status}</p>
      <div className="flex-md">
        <button
          className="btn btn--dark"
          onClick={() => navigate(-1)}
        >
          <span><ArrowUturnLeftIcon width={20} /> Go back</span>
        </button>

        <Link to={"/"} className="btn btn--dark">
          <span><HomeIcon width={20} /> Home</span>
        </Link>
      </div>
    </div>
  )
}

export default Error
