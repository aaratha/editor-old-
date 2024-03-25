import { IoSettingsSharp } from 'react-icons/io5'
import { IoFileTrayStacked } from 'react-icons/io5'
import { MdOutlineKeyboardDoubleArrowLeft } from 'react-icons/md'
import { FaSave } from 'react-icons/fa'
import { MdDeleteOutline } from 'react-icons/md'

export const Menu = (): JSX.Element => {
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0
  const handleSettingsClick = () => {
    const settings = document.querySelector('.settings')
    if (settings) {
      settings.classList.toggle('hidden')
      settings.classList.add('flex')
    }
  }
  return (
    <div
      className={`flex flex-col h-full w-[15rem] pl-[6px] pb-[6px] ${isMac ? 'pt-[2rem]' : 'pt-[0rem]'}`}
    >
      <div className="flex flex-row w-full h-[2rem] pl-1 pr-1 justify-between mb-2">
        <button className="tray-item">
          <IoFileTrayStacked />
        </button>
        <button className="tray-item">
          <FaSave />
        </button>
        <button className="tray-item" onClick={handleSettingsClick}>
          <IoSettingsSharp />
        </button>
        <button className="tray-item">
          <MdOutlineKeyboardDoubleArrowLeft />
        </button>
      </div>
      <div className="menu-item">
        <button className="menu-button group">
          <div className="flex flex-col w-full h-full">
            <h1>Start</h1>
            <p>03.21.2024</p>
          </div>
          <button
            id="delete"
            className="opacity-0 group-hover:opacity-100 flex w-8 align-middle items-center justify-center h-full text-text-color hover:text-red transition-all text-xl"
          >
            <MdDeleteOutline />
          </button>
        </button>
      </div>
      <div className="menu-item">
        <button className="menu-button group">
          <div className="flex flex-col w-full h-full">
            <h1>Notes</h1>
            <p>03.21.2024</p>
          </div>
          <button
            id="delete"
            className="opacity-0 group-hover:opacity-100 flex w-8 align-middle items-center justify-center h-full text-text-color hover:text-red transition-all text-xl"
          >
            <MdDeleteOutline />
          </button>
        </button>
      </div>
      <div className="menu-item">
        <button className="menu-button group">
          <div className="flex flex-col w-full h-full">
            <h1>School</h1>
            <p>03.21.2024</p>
          </div>
          <button
            id="delete"
            className="opacity-0 group-hover:opacity-100 flex w-8 align-middle items-center justify-center h-full text-text-color hover:text-red transition-all text-xl"
          >
            <MdDeleteOutline />
          </button>
        </button>
      </div>
    </div>
  )
}