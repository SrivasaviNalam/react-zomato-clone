import { Link } from "react-router-dom"
const PageNotFound = () => {
  return (
    <>
      <h1>404 Error</h1>
      <p>Page not found</p>
      <p>Please click this <Link to='/'>link</Link> to return to home page</p>
    </>
  )
}

export default PageNotFound;