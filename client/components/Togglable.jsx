import { useState, forwardRef, useImperativeHandle } from "react"
import PropTypes from "prop-types"


const Togglable = forwardRef(( props, ref ) => {
  const [visible, setVisible] = useState(false)

  const showWhenVisible = { display: visible ? "unset" : "none" }
  const hideWhenVisible = { display: visible ? "none" : "unset" }

  const toggleVisibility = () => { setVisible(!visible) }

  useImperativeHandle(ref, () => {
    return { toggleVisibility }
  })

  return (
    <div>
      <div style={hideWhenVisible}>
        <button onClick={toggleVisibility}>{props.buttonLabel}</button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <button onClick={toggleVisibility}>cancel</button>
      </div>
    </div>
  )
})

Togglable.displayName = "Togglable"

Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired,
  children: PropTypes.object.isRequired
}

export default Togglable
