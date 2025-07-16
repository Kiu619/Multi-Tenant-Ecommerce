import { RefObject } from "react"
export const useDropdownPosition = (
  ref: RefObject<HTMLDivElement | null> | RefObject<HTMLDivElement>
) => {
  const getDropdownPosition = () => {
    if (!ref.current) return { top: 0, left: 0 }
    const rect = ref.current.getBoundingClientRect()
    const dropdownWidth = 240

    // Calculate the initial position
    let left = rect.left + window.scrollX
    let top = rect.bottom + window.scrollY

    // check if dropdown is out of screen
    if (left + dropdownWidth > window.innerWidth) {
      left = rect.right + window.scrollX - dropdownWidth

      // if still out of screen
      if (left < 0) {
        left = window.innerWidth - dropdownWidth - 16
      }
    }
    // ensure dropdown does not go off left edge
    if (left < 0) {
      left = 16
    }

    return {
      top,
      left
    }
  }



  return {
    getDropdownPosition
  }
}
