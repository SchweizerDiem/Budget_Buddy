// assets
import { Form, NavLink } from "react-router-dom"
import logo from "../../public/favicon.svg"

// icons
import { BeakerIcon, TrashIcon } from '@heroicons/react/24/solid'

const Nav = ({ userName }) => {
  return (
    <nav>
      <NavLink to="/" aria-label="Go to home">
        <img src={logo} alt="logo" />
        <span>Budget Buddy</span>
      </NavLink >
      {
        userName && (
          <Form
            method="post"
            action="/logout"
            onSubmit={(event) => {
              if (!confirm("Delete user and all data")) {
                event.preventDefault()
              }
            }
            }
          >
            <button type="submit" className="btn btn--warning">
              <span>Delete User</span>
              <TrashIcon width={20} />
            </button>
          </Form>
        )
      }
    </nav>
  )
}

export default Nav
