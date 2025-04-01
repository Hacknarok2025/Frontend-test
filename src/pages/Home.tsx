import Modal from "@/commons/Modal.tsx";
import {useState} from "react";

const Home = () => {
  const [isModalOpen, setModalOpen] = useState(true);

  return <div>Home
    <Modal open={isModalOpen} setOpen={setModalOpen} />

    <h1 onClick={()=>{setModalOpen(true)}}>dupa</h1>
  </div>;
};

export default Home;
