import "./App.css";
import { Invoice } from "./components/Invoice";

function App() {
  return (
    <>
      <div className="overflow-hidden w-screen gap-10 font-extrabold text-5xl items-center flex flex-col py-20 bg-black text-white">
        INVOICE
        <Invoice />
      </div>
    </>
  );
}

export default App;
