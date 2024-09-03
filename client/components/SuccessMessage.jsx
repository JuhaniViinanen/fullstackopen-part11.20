import PropTypes from "prop-types"

const SuccessMessage = ({ message }) => {
  if (!message) return null
  return (<div className="successMessage">{message}</div>)
}

SuccessMessage.propTypes = {
  message: PropTypes.string.isRequired
}

export default SuccessMessage
