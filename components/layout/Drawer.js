export default function Drawer({ children, isOpen }) {
  console.log(isOpen);
  return (
    <div
      className={
        "fixed top-20 right-0 bottom-0 left-0 bg-dark z-10 transform ease-in-out transition duration-300 " +
        (isOpen ? "translate-x-0" : "translate-x-full")
      }
    >
      {children}
    </div>
  );
}
