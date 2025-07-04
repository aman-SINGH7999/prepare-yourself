import ReactDOM from 'react-dom'

export default function Modal({ children, onClose }) {
  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-[#fff2] p-6 shadow-lg w-fit relative">
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 cursor-pointer"
        >
          ✖
        </button>
        {children}
      </div>
    </div>,
    document.getElementById('modal-root')
  )
}
