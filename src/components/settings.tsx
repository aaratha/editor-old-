import { FaXmark } from "react-icons/fa6";

export const Settings = () => {

  const handleClose = () => {
    const settings = document.querySelector('.settings')
    if (settings) {
      settings.classList.toggle('hidden')
      settings.classList.remove('flex')
    }
  }

  return (
    <div className="settings items-center justify-center h-screen w-screen absolute hidden">
      <div className=" p-8 relative border border-border-color w-[40rem] h-[30rem] rounded-xl bg-menu-color">
        <button onClick={handleClose} className="absolute top-5 right-5 border rounded-md w-[1.8rem] h-[1.8rem] border-border-color justify-center flex items-center align-middle hover:bg-focus-color"><FaXmark /></button>
        <h1 className="text-xl">Settings</h1>
        <p>Settings content</p>
      </div>
    </div>
  )
}
