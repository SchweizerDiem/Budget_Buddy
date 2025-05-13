import { Form } from "react-router-dom"

import { UserPlusIcon } from "@heroicons/react/24/solid"

import ilustrations from "../assets/illustration.jpg"

const Intro = () => {
  return (
    <div className="intro">
      <div>
        <h1>
          Track, Manage, <span className="accent">Succeed</span>
        </h1>
        <p>
          BudgetBuddy: Easy financial management for stores with user-friendly tracking and charts.
        </p>
        <Form method="post">
          <input
            type="text"
            name="userName"
            required
            placeholder="Tell us your name"
            aria-label="Your name"
            autoComplete="given-name" />
          <button type="submit" className="btn btn--dark" style={{ marginTop: "22px" }}>
            <span>Create account <UserPlusIcon width={20} /></span>
          </button>
        </Form>
      </div>
      <img src={ilustrations} alt="ilustration" />
    </div>
  )
}

export default Intro
